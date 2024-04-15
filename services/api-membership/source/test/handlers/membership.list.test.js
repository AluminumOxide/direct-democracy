const api_membership_client = require('@AluminumOxide/direct-democracy-membership-api-client')
const { reset_test_data } = require('../helper')

describe('List', () => {
	const test_data = reset_test_data()

	test('List all', async () => {
		const mems = await api_membership_client.membership_list({})
		expect(mems.length).toBe(30)
	})
	test('Sort by membership_id asc', async() => {
		const mems = await api_membership_client.membership_list({
			sort: 'membership_id',
			order: 'ASC'
		})
		expect(mems[0].membership_id).toBe(test_data['membership']['verified_grandchild_3']['id'])	
	})
// TODO: fix created/updated dates in test data
//	test('Sort by date_created desc', async() => {
//		const mems = await api_membership_client.membership_list({
//			sort: 'date_created',
//			order: 'DESC'
//		})
//		expect(mems[0].membership_id).toBe(test_data['membership']['verified_root_1']['id'])	
//	})
//	test('Sort by date_updated asc', async() => {
//		const mems = await api_membership_client.membership_list({
//			sort: 'date_updated',
//			order: 'ASC'
//		})
//		expect(mems[0].membership_id).toBe(test_data['membership']['verified_root_1']['id'])	
//	})
	test('Filter by democracy_id equals', async() => {
		const mems = await api_membership_client.membership_list({
			filter: {
				democracy_id: {
					op: "=",
					val: test_data['democracy']['root_child']['id'] 
				}
			}
		})
		expect(mems.length).toBe(10)
	})
	test('Filter by profile_id in list', async() => {
		const mems = await api_membership_client.membership_list({
			filter: {
				profile_id: {
					op: "IN",
					val: [ 
						test_data['membership']['verified_root_1']['profile_id'],
						test_data['membership']['verified_root_2']['profile_id']  
					]
				}
			}
		})
		expect(mems.length).toBe(2)
	})
	test('Filter by is_verified not equals', async() => {
		const mems = await api_membership_client.membership_list({
			filter: {
				is_verified: {
					op: "!=",
					val: true 
				}
			}
		})
		expect(mems.length).toBe(14)
	})
	test('Filter by date_created less than', async() => {
		const mems = await api_membership_client.membership_list({
			filter: {
				date_created: {
					op: "<",
					val: new Date().toJSON()
				}
			}
		})
		expect(mems.length).toBe(30)
	})
	test('Filter by date_updated greater than', async() => {
		const mems = await api_membership_client.membership_list({
			filter: {
				date_updated: {
					op: ">",
					val: new Date().toJSON()
				}
			}
		})
		expect(mems.length).toBe(0)
	})
	test('Limit & last', async() => {
		const mems = await api_membership_client.membership_list({
			sort: 'membership_id',
			order: 'ASC',
			limit: 1,
			last: test_data['membership']['verified_root_6']['id']
		})
		expect(mems[0].membership_id).toBe(test_data['membership']['unverified_child_3']['id'])
	})
})
