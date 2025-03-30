const { errors,
	integration_test_setup,
	integration_test_query,
	fill_buckets_integration: fill_i,
	clean_token_integration: clean_token_i } = require('./helper')

describe('End-to-End Tests', () => {

	const test_data = integration_test_setup()

	test('Success', async() => {

		// fill buckets
		await fill_i(1)

		// grab all clean tokens
		const clean_query = await integration_test_query('token',`select token from token where bucket='profile'`)
		const clean_tokens = clean_query.rows.map((r) => { return r.token })

		// grab a dirty token
		const dirty_query = await integration_test_query('account',`select token from token where bucket='email' limit 1`)
		const dirty_token = dirty_query.rows[0].token

		// clean dirty token
		const clean_token = await clean_token_i(dirty_token)

		// make sure we got back a clean token
		expect(clean_tokens.indexOf(clean_token) > -1)

	}, 50000)
})
