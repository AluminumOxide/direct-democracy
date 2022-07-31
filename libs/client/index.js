const Ajv = require('ajv/dist/2019')
const axios = require('axios')

class ApiClient {

	constructor(spec_file, env = 'production', error_file = {}) {
		this.spec_file = spec_file
		this.errors = require(error_file)
		this.env = env
		this.ajv = new Ajv({
			coerceTypes: false,
			removeAdditional: true,
			strict: true,
			strictSchema: true,
			strictNumbers: true,
			strictTypes: true,
			strictTuples: true,
			strictRequired: true
		})
		this.ready = this.load()
	}

	add_defn(x) {
		for(const x_id in this.schema[x]) {
			let x_defn = this.schema[x][x_id]
			this.ajv.addSchema(x_defn)
		}
	}

	async load () {

		// load spec
		this.schema = this.spec_file
		this.add_defn('schemas')
		this.add_defn('headers')
		this.add_defn('params')
		this.add_defn('queries')
		this.add_defn('bodies')
		this.add_defn('responses')
		
		// get server
		if(!this.env in this.schema.servers) {
			this.env = "production"
			if(!this.env in this.schema.servers) {
				this.env = this.schema.servers[this.schema.servers.keys()[0]]
			}	
		}
		this.url = this.schema.servers[this.env]

		// go through routes
		for(const route in this.schema.routes) {
			for(const op in this.schema.routes[route]) {
				const defn = this.schema.routes[route][op]
				const opid = defn.operationId

				// add endpoint function
				this[opid] = async function(args) {
					let request = { params: {}, query: {}, body: Object.assign({}, args)}

					// verify params
					if('param' in defn) {
						for(const param in defn.param) {
							if(!!args && param in args && !!args[param]) {
								if(! this.ajv.validate(defn.param[param], args[param])) {
									throw new Error(`Invalid parameter type ${param} expected ${JSON.stringify(defn.param[param])}`)
								}
								request.params[param] = args[param]
								delete request.body[param]
							}
						}
					}

					// verify query
					if('query' in defn) {
						for(const query in defn.query) {
							if(!!args && query in args && !!args[query]) {
								if(! this.ajv.validate(defn.query[query], args[query])) {
									throw new Error(`Invalid query type ${query} expected ${JSON.stringify(defn.query[query])}`)
								}
								if(defn.type === "object") {
									request.query[query] = JSON.stringify(args[query])
								} else {
									request.query[query] = args[query]
								}
								delete request.body[query]
							}
						}
					}

					// verify body
					if('body' in defn) {
						request.headers = {'Content-Type':'application/json'}
						if(! this.ajv.validate(defn.body, request.body)) {
							throw new Error(`Invalid body ${request.body} expected ${JSON.stringify(defn.body)}`)
						}
						request.body = JSON.stringify(request.body)
					} else {
						if(Object.keys(request.body).length > 0) {
							throw new Error(`Invalid arguments ${JSON.stringify(request.body)} expected nothing`)
						}
						delete request.body
					}
					
					// calculate request uri
					let uri = this.url
					uri = uri + route
					uri = uri.split('/').map(s => { 
						if(s[0] === ':') {
							return request.params[s.substring(1)]
						}
						return s
					}).join('/')
					if(Object.keys(request.query).length > 0) {
						uri = uri + '?' + Object.keys(request.query).map(a => {
							if(typeof(request.query[a]) === 'object') {
								return a+'='+JSON.stringify(request.query[a])
							} else {
								return a+'='+request.query[a]
							}
						}).join('&')
					}

					// make request and return results
					try {
						const response = await axios({
							method: op.toLowerCase(),
							url: uri,
							headers: { 'content-type': 'application/json' },
							data: request.body
						})
						if(response.status >= 400) {
							throw new Error(response.data.message)
						}
						return response.data
					} catch(e) {
						throw new Error(e)
					}
				}
			}
		}
	}	
}

module.exports = ApiClient
