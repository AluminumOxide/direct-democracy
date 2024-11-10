const Ajv = require('ajv')
const axios = require('axios')

function get_client(schema, errors) {
	const api_client = new ApiClient(schema, errors)
	const env = process.env.ENV
	api_client.load(env)
	return api_client
}

class ApiClient {

	constructor(schema = {}, errors = {}) {
		this.schema = schema
		this.errors = errors
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
	}

	load (env) {

		// get env from caller
		this.env = env

		// load spec
		function add_defn(that, x) {
			for(const x_id in that.schema[x]) {
				let x_defn = that.schema[x][x_id]
				that.ajv.addSchema(x_defn)
			}
		}
		add_defn(this, 'schemas')
		add_defn(this, 'headers')
		add_defn(this, 'params')
		add_defn(this, 'queries')
		add_defn(this, 'bodies')
		add_defn(this, 'responses')
		
		// get server
		if(!(this.env in this.schema.servers)) {
			this.env = Object.keys(this.schema.servers)[0]
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
							if(!!args && param in args) {
								if(!!args[param]) {
									if(! this.ajv.validate(defn.param[param], args[param])) {
										throw new Error(`Invalid parameter type ${param} expected ${JSON.stringify(defn.param[param])}`)
									}
									request.params[param] = args[param]
								}
								delete request.body[param]
							}
						}
					}

					// verify query
					if('query' in defn) {
						for(const query in defn.query) {
							if(!!args && query in args) {
								if(!!args[query]) {
									if(! this.ajv.validate(defn.query[query], args[query])) {
										throw new Error(`Invalid query type ${query} expected ${JSON.stringify(defn.query[query])}`)
									}
									if(defn.type === "object") {
										request.query[query] = JSON.stringify(args[query])
									} else {
										request.query[query] = args[query]
									}
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
							data: request.body ? request.body : {}
						})
						if(response.status >= 400) {
							throw new Error(response.data.message)
						}
						return response.data
					} catch(e) {
						throw new Error(e.response.data.message)
					}
				}
			}
		}
	}	
}

module.exports = get_client
