const { reqData } = require('./request')

const add_defn = function(x, spec, fastify, autodoc) {
	for(const x_id in spec[x]) {
		let x_defn = spec[x][x_id]
		autodoc.add_schema(x, x_id, x_defn)
		fastify.addSchema(x_defn)
	}
}

const add_routes = function(spec, version, handlers, fastify, autodoc) {	
	for( const url in spec ) {
		for( const method in spec[url] ) {

			const op_id = spec[url][method]['operationId']
			let schema = {}
			if('query' in spec[url][method]) {
				schema.query = spec[url][method].query
			}
			if('param' in spec[url][method]) {
				schema.param = spec[url][method].param
			}
			if('body' in spec[url][method]) {
				schema.body = spec[url][method].body
			} 
			fastify.route({
				method,
				url: `/${version}${url}`,
				schema,
				handler: async function(req, reply) {
					return await handlers[op_id](reqData(req), reply, fastify.knex, req.log)
				}
			})
			autodoc.add_route(method, `/${version}${url}`, Object.assign(schema, {
				description: spec[url][method].description,
				operationId: spec[url][method].operationId,
				responses: spec[url][method].responses
			}))
		}
	}
}

module.exports = { add_defn, add_routes }
