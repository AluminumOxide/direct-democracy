const { queryParser } = require('./request')
const { pageQuery } = require('./db')
const { add_defn, add_routes } = require('./spec')

const start = async function({ address, port, spec, version, handlers, db_user, db_password, db_name, db_port, db_address }) {

	try {
		// set up fastify
		const fastify = require('fastify')({ logger: true, querystringParser: queryParser })

		// connect to db
		await fastify.register(require('./fastify-knexjs'), {
			client: 'pg',
			connection: `postgres://${db_user}:${db_password}@${db_name}:${db_port}/${db_address}`
		})
	  	fastify.knex.pageQuery = pageQuery

		// use custom ajv instance
		const Ajv = require('ajv/dist/2019')
		const ajv = new Ajv({
			coerceTypes: false,
			removeAdditional: true,
			strict: true,
			strictSchema: true,
			strictNumbers: true,
			strictTypes: true,
			strictTuples: true,
			strictRequired: true
		})
		fastify.setValidatorCompiler(({ schema }) => { return ajv.compile(schema) })

		// add definitions from spec
		add_defn('schemas', spec, ajv)
		add_defn('headers', spec, ajv)
		add_defn('params', spec, ajv)
		add_defn('queries', spec, ajv)
		add_defn('bodies', spec, ajv)
		add_defn('responses', spec, ajv)

		// add routes from spec
		add_routes(spec.routes, version, handlers, fastify)

		// startup server
		await fastify.listen(port, address)

	// handle errors
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

module.exports = { start }
