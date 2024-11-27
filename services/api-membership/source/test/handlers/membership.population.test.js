const { 
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	integration_test_setup,
	membership_population_unit: mem_pop_u,
	membership_population_integration: mem_pop_i
} = require('../helper')

describe('Population', () => {

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
				last_val: [],
				throws_error: false
			}])

			// call handler
			await mem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith([])

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: database failure
		test('Error: Database failure', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'pageQuery',
				last_args: false,
				last_val: [],
				throws_error: true
			}])

			// call handler
			await mem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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

		// success: no params
		test('Success', async () => {
			const mems = await mem_pop_i({})
			expect(mems[0].democracy_id).toBe(test_data['democracy']['not_root_child'].id)
			expect(mems[0].population_verified).toBe(test_data['democracy']['not_root_child'].population_verified)
			expect(mems[0].population_unverified).toBe(test_data['democracy']['not_root_child'].population_unverified)
			expect(mems[1].democracy_id).toBe(test_data['democracy']['root_child'].id)
			expect(mems[1].population_verified).toBe(test_data['democracy']['root_child'].population_verified)
			expect(mems[1].population_unverified).toBe(test_data['democracy']['root_child'].population_unverified)
			expect(mems[2].democracy_id).toBe(test_data['democracy']['root'].id)
			expect(mems[2].population_verified).toBe(test_data['democracy']['root'].population_verified)
			expect(mems[2].population_unverified).toBe(test_data['democracy']['root'].population_unverified)
		})

		// success: limit set
		test('Success: Limit set', async () => {
			const mems = await mem_pop_i({
				limit: 1
			})
			expect(mems.length).toBe(1)
		})

		// success: limit & last set
		test('Success: Limit set', async () => {
			const mems = await mem_pop_i({
				limit: 1,
				last: test_data['democracy']['not_root_child'].id
			})
			expect(mems.length).toBe(1)
			expect(mems[0].democracy_id).toBe(test_data['democracy']['root_child'].id)
		})

		// success: order set
		test('Success: Order set', async () => {
			const mems = await mem_pop_i({
				order: 'DESC'
			})
			expect(mems[0].democracy_id).toBe(test_data['democracy']['root'].id)
		})

		// success: filter by democracy_id
		test('Success: Filter by democracy id', async () => {
			const mems = await mem_pop_i({
				filter: {
					democracy_id: {
						op: '=',
						val: test_data['democracy']['root'].id
					}
				}
			})
			expect(mems.length).toBe(1)
			expect(mems[0].democracy_id).toBe(test_data['democracy']['root'].id)
		})

		// success: filter by date_updated
		test('Success: Filter by date updated', async () => {
			const mems = await mem_pop_i({
				filter: {
					date_updated: {
						op: '<',
						val: new Date().toJSON() 
					}
				}
			})
			expect(mems.length).toBe(3)
		})

		// success: filter by verified
		test('Success: Filter by verified population', async () => {
			const mems = await mem_pop_i({
				filter: {
					population_verified: {
						op: '>',
						val: 5 
					}
				}
			})
			expect(mems.length).toBe(1)
		})

		// success: filter by unverified
		test('Success: Filter by unverified population', async () => {
			const mems = await mem_pop_i({
				filter: {
					population_unverified: {
						op: '!=',
						val: 5 
					}
				}
			})
			expect(mems.length).toBe(1)
		})

		// success: limit, last, order & filter set
		test('Success: Limit, last, filter and order', async () => {
			const mems = await mem_pop_i({
				limit: 1,
				last: test_data['democracy']['root'].id,
				order: 'DESC',
				filter: {
					date_updated: {
						op: '<',
						val: new Date().toJSON() 
					}
				}
			})
			expect(mems[0].democracy_id).toBe(test_data['democracy']['root_child'].id)
		})

		// error: invalid limit
		test('Error: Invalid limit', async() => {
			await expect(mem_pop_i({
				limit: 'bad' 
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid last
		test('Error: Invalid last', async() => {
			await expect(mem_pop_i({
				last: 'bad' 
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid order
		test('Error: Invalid order', async() => {
			await expect(mem_pop_i({
				order: 'bad' 
			})).rejects.toThrow(errors._invalid_query)
		})

		// TODO: error: invalid filter field
		//test('Error: Invalid filter field', async() => {
		//	await expect(mem_pop_i({
		//		filter: {
		//			bad_field: {
		//				op: '=',
		//				val: 'asdf'
		//			}
		//		}
		//	})).rejects.toThrow(errors._invalid_query)
		//})

		// error: invalid filter op
		test('Error: Invalid filter op', async() => {
			await expect(mem_pop_i({
				filter: {
					date_updated: {
						op: 'bad',
						val: new Date().toJSON() 
					}
				}
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid filter val
		test('Error: Invalid filter op', async() => {
			await expect(mem_pop_i({
				filter: {
					date_updated: {
						op: '<',
						val: 'bad'
					}
				}
			})).rejects.toThrow(errors._invalid_query)
		})
	})
})
