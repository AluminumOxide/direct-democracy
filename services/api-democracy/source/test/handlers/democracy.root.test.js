const api_democracy_client = require('@AluminumOxide/direct-democracy-democracy-api-client')
const { reset_test_data } = require('../helper')

describe('Root', () => {
	const test_data = reset_test_data()
	test('Success', async () => {
		const expected = test_data['democracy']['root']
		const actual = await api_democracy_client.democracy_root({})
		expect(actual.democracy_id).toBe(expected.id)
		expect(actual.democracy_name).toBe(expected.name)
		expect(actual.democracy_description).toBe(expected.description)
		expect(actual.democracy_conduct).toEqual(expected.conduct)
		expect(actual.democracy_content).toEqual(expected.content)
		expect(actual.democracy_metas).toEqual(expected.metas)
		expect(Object.keys(actual)).toEqual(expect.arrayContaining(['democracy_population_verified','democracy_population_unverified','date_created','date_updated']))
	})
})
