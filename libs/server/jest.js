// reset test data before each test
global.beforeEach(() => {
	try { 
		const pg = require('knex')({
			client: 'pg',
			connection:  process.env.TEST_CONNECTION_STRING
		})
		pg.raw('call reset_test_data();')
	} catch (err) {
		console.error(err)
	}
});
