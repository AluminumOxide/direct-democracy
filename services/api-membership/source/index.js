const fastify = require('fastify')({ logger: true })
const { start } = require('@aluminumoxide/openapi-3.1-server')
start({
	address: process.env.API_MEMBERSHIP_URL,
	port: process.env.API_MEMBERSHIP_PORT,
	spec: './spec.json',
	version: 'v1',
	handlers: require('./handlers/'),
	db_user: process.env.DB_MEMBERSHIP_USER,
	db_password: process.env.DB_MEMBERSHIP_PASSWORD,
	db_name: process.env.DB_NAME,
	db_port: process.env.DB_PORT,
	db_address: process.env.DB_MEMBERSHIP_DB,
	fastify
})

