const {
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	integration_test_setup,
	membership_list_unit: mem_list_u,
	membership_list_integration: mem_list_i
} = require('../helper')

describe('Membership List', () => {

	describe('Unit Tests', () => {

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'pageQuery',
				last_args: false,
				throws_error: false,
				last_val: []
			}])

			// call handler
			await mem_list_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith([])

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: db
		test('Error: DB Failure', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'pageQuery',
				last_args: false,
				throws_error: true,
				last_val: []
			}])

			// call handler
			await mem_list_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		// success: list all
		test('List all', async () => {
			const mems = await mem_list_i({})
			expect(mems.length).toBe(30)
		})

		// sort by membership id asc
		test('Sort by membership_id asc', async() => {
			const mems = await mem_list_i({
				sort: 'membership_id',
				order: 'ASC'
			})
			expect(mems[0].membership_id).toBe(test_data['membership']['verified_grandchild_3']['id'])	
		})

		// sort by date created desc
		test('Sort by date_created desc', async() => {
			const mems = await mem_list_i({
				sort: 'date_created',
				order: 'DESC'
			})
			expect(mems[0].membership_id).toBe(test_data['membership']['verified_root_1']['id'])	
		})

		// sort by date updated asc
		test('Sort by date_updated asc', async() => {
			const mems = await mem_list_i({
				sort: 'date_updated',
				order: 'ASC'
			})
			expect(mems[0].membership_id).toBe(test_data['membership']['verified_root_1']['id'])	
		})

		// limit & last
		test('Limit and last', async() => {
			const mems = await mem_list_i({
				sort: 'membership_id',
				order: 'ASC',
				limit: 1,
				last: test_data['membership']['verified_root_1'].id
			})
			expect(mems[0].membership_id).toBe(test_data['membership']['unverified_child_1']['id'])
			expect(mems.length).toBe(1)
		})

		// error: invalid sort
		test('Error: Invalid sort', async() => {
			await expect(mem_list_i({
				sort: 'bad_val'
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid order
		test('Error: Invalid order', async() => {
			await expect(mem_list_i({
				order: 'bad_val'
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid limit
		test('Error: Invalid limit', async() => {
			await expect(mem_list_i({
				sort: 'membership_id',
				order: 'ASC',
				limit: -1,
				last: test_data['membership']['verified_root_1'].id
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid last
		test('Error: Invalid last', async() => {
			await expect(mem_list_i({
				sort: 'membership_id',
				order: 'ASC',
				limit: 1,
				last: 1
			})).rejects.toThrow(errors._invalid_query)
		})

		// filter by democracy_id equals
		test('Filter by democracy_id equals', async() => {
			const mems = await mem_list_i({
				filter: {
					democracy_id: {
						op: "=",
						val: test_data['democracy']['root_child']['id'] 
					}
				}
			})
			expect(mems.length).toBe(10)
		})

		// filter by profile id in list
		test('Filter by profile_id in list', async() => {
			const mems = await mem_list_i({
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

		// filter by is verified not equals
		test('Filter by is_verified not equals', async() => {
			const mems = await mem_list_i({
				filter: {
					is_verified: {
						op: "!=",
						val: true 
					}
				}
			})
			expect(mems.length).toBe(14)
		})

		// filter by date created less than
		test('Filter by date_created less than', async() => {
			const mems = await mem_list_i({
				filter: {
					date_created: {
						op: "<",
						val: new Date().toJSON()
					}
				}
			})
			expect(mems.length).toBe(30)
		})

		// filter by date updated greater than
		test('Filter by date_updated greater than', async() => {
			const mems = await mem_list_i({
				filter: {
					date_updated: {
						op: ">",
						val: new Date().toJSON()
					}
				}
			})
			expect(mems.length).toBe(0)
		})

		// TODO error: invalid filter field
		//test('Error: Invalid filter field', async() => {
		//	await expect(mem_list_i({
		//		filter: {
		//			bad_field: {
		//				op: '<',
		//				val: 'asdf'
		//			}
		//		}
		//	})).rejects.toThrow(errors._invalid_query)
		//})

		// error: invalid filter op
		test('Error: Invalid filter op', async() => {
			await expect(mem_list_i({
				filter: {
					date_created: {
						op: 'bad',
						val: new Date().toJSON()
					}
				}
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid filter value
		test('Error: Invalid filter value', async() => {
			await expect(mem_list_i({
				filter: {
					date_created: {
						op: '=',
						val: 'bad'
					}
				}
			})).rejects.toThrow(errors._invalid_query)
		})
	})
})
