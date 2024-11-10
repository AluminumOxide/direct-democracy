const {
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	reset_test_data,
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
	
		test('List all', async () => {
			const test_data = await reset_test_data()
			const mems = await mem_list_i({})
			expect(mems.length).toBe(30)
		})
		test('Sort by membership_id asc', async() => {
			const test_data = await reset_test_data()
			const mems = await mem_list_i({
				sort: 'membership_id',
				order: 'ASC'
			})
			expect(mems[0].membership_id).toBe(test_data['membership']['verified_grandchild_3']['id'])	
		})
	// TODO: fix created/updated dates in test data
	//	test('Sort by date_created desc', async() => {
	//		const mems = await mem_list_i({
	//			sort: 'date_created',
	//			order: 'DESC'
	//		})
	//		expect(mems[0].membership_id).toBe(test_data['membership']['verified_root_1']['id'])	
	//	})
	//	test('Sort by date_updated asc', async() => {
	//		const mems = await mem_list_i({
	//			sort: 'date_updated',
	//			order: 'ASC'
	//		})
	//		expect(mems[0].membership_id).toBe(test_data['membership']['verified_root_1']['id'])	
	//	})
		test('Filter by democracy_id equals', async() => {
			const test_data = await reset_test_data()
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
		test('Filter by profile_id in list', async() => {
			const test_data = await reset_test_data()
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
		test('Filter by is_verified not equals', async() => {
			const test_data = await reset_test_data()
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
		test('Filter by date_created less than', async() => {
			const test_data = await reset_test_data()
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
		test('Filter by date_updated greater than', async() => {
			const test_data = await reset_test_data()
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
		test('Limit & last', async() => {
			const test_data = await reset_test_data()
			const mems = await mem_list_i({
				sort: 'membership_id',
				order: 'ASC',
				limit: 1,
				last: test_data['membership']['verified_root_6']['id']
			})
			expect(mems[0].membership_id).toBe(test_data['membership']['unverified_child_3']['id'])
		})
	})
})
