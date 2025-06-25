const {
	errors,
	get_uuid,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	integration_test_setup,
	ballot_list_unit: blt_list_u,
	ballot_list_integration: blt_list_i
} = require('../helper') 
	
describe('List', () => {

	describe('Unit Tests', () => {

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'pageQuery', 
				args: false,
				err: false, 
				val: []
			}])
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith([])
			
			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

                // error: db
                test('Error: Database error', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'pageQuery',
				args: false,
				err: new Error('db error')
			}])
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
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
		test('Success: List all', async () => {
			const blts = await blt_list_i({})
			expect(blts.length === test_data['ballot'].length)
		})

		// sort by date_created asc
		test('Sort by date created asc', async () => {
			const blts = await blt_list_i({
				sort: 'date_created',
				order: 'ASC'
			})
			expect(blts[0].ballot_id).toBe(test_data['ballot']['rnf_au_1'].id)
		})
		
		// sort by date_updated desc
		test('Sort by date updated desc', async () => {
			const blts = await blt_list_i({
				sort: 'date_updated',
				order: 'DESC'
			})
			expect(blts[0].ballot_id).toBe(test_data['ballot']['rnf_au_1'].id)
		})
	
		// limit & last
		test('Limit and last', async () => {
			const blts = await blt_list_i({
				sort: 'date_created',
				order: 'DESC',
				limit: 1,
				last: (new Date).toJSON()	
			})
			expect(blts[0].ballot_id).toBe(test_data['ballot']['rnf_au_1'].id)
		})

		// error: invalid sort
		test('Error: Invalid sort', async () => {
			await expect(blt_list_i({
				sort: 'bad_val'
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid order
		test('Error: Invalid sort', async () => {
			await expect(blt_list_i({
				order: 'bad_val'
			})).rejects.toThrow(errors._invalid_query)
		})
		
		// error: invalid limit
		test('Error: Invalid limit', async () => {
			await expect(blt_list_i({
				limit: 'bad_val'
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid last value
		test('Error: Invalid last value', async () => {
			await expect(blt_list_i({
				sort: 'date_created',
				order: 'ASC',
				limit: 1,
				last: 1
			})).rejects.toThrow(errors._invalid_query)
		})

		// filter by membership_id in list
		test('Filter by membership id in list', async () => {
			const blts = await blt_list_i({
				filter: {
					membership_id: {
						op: 'IN',
						val: [
							test_data['ballot']['rnf_dv_1'].membership_id,
							test_data['ballot']['rnf_dv_2'].membership_id
						]
					}
				}
			})
			expect(blts.length).toBe(4)
		})

		// filter by ballot_approved equals
		test('Filter by ballot approved equals', async () => {
			const blts = await blt_list_i({
				filter: {
					ballot_approved: {
						op: '=',
						val: true
					}
				}
			})
			expect(blts.length).toBe(16)
		})
		
		// filter by ballot_verified not equals
		test('Filter by ballot verified not equals', async () => {
			const blts = await blt_list_i({
				filter: {
					ballot_verified: {
						op: '!=',
						val: true
					}
				}
			})
			expect(blts.length).toBe(9)
		})

		// filter by ballot_comments contains
		test('Filter by ballot comments contains', async () => {
			const blts = await blt_list_i({
				filter: {
					ballot_comments: {
						op: '~',
						val: 'test'
					}
				}
			})
			expect(blts.length).toBe(4)
		})

		// filter by date_created less than
		test('Filter by date created less than', async () => {
			const blts = await blt_list_i({
				filter: {
					date_created: {
						op: '<',
						val: (new Date).toJSON()
					}
				}
			})
			expect(blts.length).toBe(23)
		})

		// filter by date_updated greater than
		test('Filter by date updated greater than', async () => {
			const blts = await blt_list_i({
				filter: {
					date_updated: {
						op: '>',
						val: (new Date).toJSON()
					}
				}
			})
			expect(blts.length).toBe(0)
		})

		// TODO: error: invalid filter field
		//test('Error: Invalid filter field', async () => {
		//	await expect(blt_list_i({
		//		filter: {
		//			bad_field: {
		//				op: '=',
		//				val: (new Date).toJSON()
		//			}
		//		}
		//	})).rejects.toThrow(errors._invalid_query)
		//})

		// error: invalid filter op
		test('Error: Invalid filter op', async () => {
			await expect(blt_list_i({
				filter: {
					date_created: {
						op: 'bad',
						val: (new Date).toJSON()
					}
				}
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid filter value
		test('Error: Invalid filter value', async () => {
			await expect(blt_list_i({
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
