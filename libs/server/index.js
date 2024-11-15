const { queryParser } = require('./request')
const { pageQuery } = require('./db')
const { add_defn, add_routes } = require('./spec')
const { spawn } = require('child_process')
const testing = require('./jest')
const { AutoDoc } = require('./docs')

const start = async function({ env, address, port, spec, version, handlers, db_user, db_password, db_name, db_port, db_address }) {

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
		const Ajv = require('ajv')
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

		// set up autodocs
		const autodoc = new AutoDoc()

		// add definitions from spec
		add_defn('schemas', spec, ajv, autodoc)
		add_defn('headers', spec, ajv, autodoc)
		add_defn('params', spec, ajv, autodoc)
		add_defn('queries', spec, ajv, autodoc)
		add_defn('bodies', spec, ajv, autodoc)
		add_defn('responses', spec, ajv, autodoc)

		// add routes from spec
		add_routes(spec.routes, version, handlers, fastify, autodoc)

		// write autodocs
		await autodoc.write_docs('./README.md')

		// startup server
		await fastify.listen({ port, address })

		// run tests if applicable
		if(env === "dev") {
				const s = spawn("jest",["--runInBand"])
				s.stdout.on("data", data => {
					console.log(`${data}`)
				})
				s.stderr.on("data", data => {
					console.log(`${data}`)
				})
				s.on('error', (error) => {
					console.log(`error running jest: ${error}`)
				})
		}

	// handle errors
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

module.exports = { start, testing }
