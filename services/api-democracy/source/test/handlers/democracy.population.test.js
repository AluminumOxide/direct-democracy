const api_democracy_client = new (require('@AluminumOxide/direct-democracy-democracy-api-client'))()
const { reset_test_data } = require('../helper')

describe('Population', () => {
	const test_data = reset_test_data()
	test('Success', async () => {
		const dem = await api_democracy_client.democracy_population_update({})
		expect(true) // TODO
	})	
})
