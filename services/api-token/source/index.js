const { start } = require('@aluminumoxide/direct-democracy-lib-server')
                       
start({
	env: process.env.ENV,
	address: process.env.API_TOKEN_URL,
	port: process.env.API_TOKEN_PORT,
	spec: require('./spec.json'),
	version: 'v1',
	handlers: require('./handlers/'),
	db_user: process.env.DB_TOKEN_USER,
	db_password: process.env.DB_TOKEN_PASSWORD,
	db_name: process.env.DB_NAME,
	db_port: process.env.DB_PORT,
	db_address: process.env.DB_TOKEN_DB
})
