const { reqData } = require('./request')
const libs = require('./libs')

const add_defn = function(x, spec, fastify, autodoc) {
	for(const x_id in spec[x]) {
		let x_defn = spec[x][x_id]
		autodoc.add_schema(x, x_id, x_defn)
		fastify.addSchema(x_defn)
	}
}

const add_routes = function(spec, version, handlers, fastify, autodoc) {	

	// add routes to handle jwts
	const jwt_lib = { sign: fastify.jwt.sign, verify: fastify.jwt.verify }
	const jwt_schema = {
		description: 'Verify JWT issued by this service',
		operationId: 'jwt_verify',
		headers: {
			'type': 'object',
			'properties': { 'jwt': { 'type': 'string' } }
		},
		responses: {
			'200': { 'type': 'object' },
			'401': { '$ref': 'responses-401' },
			'500': { '$ref': 'responses-500' }
		}
	}
	fastify.route({
		method: 'GET',
		url: `/${version}/jwt/verify`,
		schema: jwt_schema,
		handler: async function(req, reply) {
			const data = await fastify.jwt.verify(req.headers.jwt)
			if(!data) {
				return reply.code(401).send(new Error('Invalid Authorization'))
			}
			return reply.code(200).send(data)
		}
	})
	autodoc.add_route('GET', `/${version}/jwt/verify`, jwt_schema)

	// add routes declared in spec file
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
			if('headers' in spec[url][method]) {
				schema.headers = {
					type: 'object',
					properties: spec[url][method].headers
				}
			}
			fastify.route({
				method,
				url: `/${version}${url}`,
				schema,
				handler: async function(req, reply) {
					return await handlers[op_id](reqData(req), reply, fastify.knex, req.log, { jwt: jwt_lib, ...libs })
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
