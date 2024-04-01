const api_democracy_client = new (require('@AluminumOxide/direct-democracy-democracy-api-client'))()
const { reset_test_data } = require('../helper')

describe('List', () => {
	const test_data = reset_test_data()
	test('List all', async () => {
		const dems = await api_democracy_client.democracy_list({})
		expect(dems.length === 3)
	})	
	test('Sort by name asc', async () => {
		const dems = await api_democracy_client.democracy_list({
			sort: "democracy_name",
			order: "ASC"
		})
		expect(dems[0].id === test_data['democracy']['root']['id'])
	})
	test('Sort by verified population desc', async () => {
		const dems = await api_democracy_client.democracy_list({
			sort: "democracy_population_verified",
			order: "DESC"
		})
		expect(dems[0].id === test_data['democracy']['root']['id'])
	})
	test('Sort by unverified population asc', async () => {
		const dems = await api_democracy_client.democracy_list({
			sort: "democracy_population_unverified",
			order: "ASC"
		})
		expect(dems[0].id === test_data['democracy']['not_root_child']['id'])
	})
	test('Sort by creation date asc', async () => {
		const dems = await api_democracy_client.democracy_list({
			sort: "date_created",
			order: "ASC"
		})
		expect(dems[0].id === test_data['democracy']['root']['id'])
	})
	test('Sort by update date desc', async () => {
		const dems = await api_democracy_client.democracy_list({
			sort: "date_updated",
			order: "DESC"
		})
		expect(dems[0].id === test_data['democracy']['root']['id'])
	})
	test('Filter by id equals', async () => {
		const dems = await api_democracy_client.democracy_list({
			filter: {
				democracy_id: {
					op: "=",
					val: test_data['democracy']['root_child']['id']
				}
			}
		})
		expect(dems.length === 1)
		expect(dems[0].id === test_data['democracy']['root_child']['id'])
	})
	test('Filter by name in list', async () => {
		const dems = await api_democracy_client.democracy_list({
			filter: {
				democracy_name: {
					op: "IN",
					val: [
						test_data['democracy']['root_child']['name'],
						test_data['democracy']['not_root_child']['name']
					]
				}
			}
		})
		expect(dems.length === 2)
	})
	test('Filter by description contains', async () => {
		const dems = await api_democracy_client.democracy_list({
			filter: {
				democracy_description: {
					op: "~",
					val: test_data['democracy']['root_child']['description']
				}
			}
		})
		expect(dems.length === 1)
	})
	test('Filter by verified population not equals', async () => {
		const dems = await api_democracy_client.democracy_list({
			filter: {
				democracy_population_verified: {
					op: "!=",
					val: 5
				}
			}
		})
		expect(dems.length === 2)
	})
	test('Filter by unverified population not equals', async () => {
		const dems = await api_democracy_client.democracy_list({
			filter: {
				democracy_population_unverified: {
					op: "!=",
					val: 5
				}
			}
		})
		expect(dems.length === 2)
	})
	test('Filter by date created greater than', async () => {
		const dems = await api_democracy_client.democracy_list({
			filter: {
				date_created: {
					op: ">",
					val: new Date().toJSON()
				}
			}
		})
		expect(dems.length === 0)
	})
	test('Filter by date updated less than', async () => {
		const dems = await api_democracy_client.democracy_list({
			filter: {
				date_updated: {
					op: "<",
					val: new Date().toJSON()
				}
			}
		})
		expect(dems.length === 3)
	})
	test('Filter with limit and last', async () => {
		const dems = await api_democracy_client.democracy_list({
			sort: "democracy_name",
			order: "ASC",
			limit: 1,
			last: test_data['democracy']['root']['name']
		})
		expect(dems[0].id === test_data['democracy']['root_child']['id'])
	})
})

