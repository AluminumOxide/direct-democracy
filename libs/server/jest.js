const test_config = function () {
	beforeAll(async () => {
		try {
			const pg = require('knex')({
				client: 'pg',
				connection:  process.env.TEST_CONNECTION_STRING
			})
			await pg.raw('call reset_test_data();')
		} catch (err) {
			console.error(err)
		}
	})
}

module.exports = { test_config }
