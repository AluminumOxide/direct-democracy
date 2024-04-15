const api_membership_client = require('@AluminumOxide/direct-democracy-membership-api-client')
const { reset_test_data } = require('../helper')

describe('Population', () => {
	const test_data = reset_test_data()
	test('Success', async () => {
		const mems = await api_membership_client.membership_population({})
		expect(true) // TODO
	})
})
