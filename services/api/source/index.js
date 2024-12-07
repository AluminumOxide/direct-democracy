const { start } = require('@aluminumoxide/direct-democracy-lib-server')

start({
	env: process.env.ENV,
	address: process.env.API_EXTERNAL_URL,
	port: process.env.API_EXTERNAL_PORT,
	spec: require('./spec.json'),
	version: 'v1',
	handlers: require('./handlers/')
})
