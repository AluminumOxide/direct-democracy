const {
	errors,
	get_dummy_api,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	integration_test_setup,
	proposal_list_unit: prop_list_u,
	proposal_list_integration: prop_list_i
} = require('../helper')

describe('Proposal List', () => {

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
			await prop_list_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'pageQuery',
				last_args: false,
				throws_error: new Error('db error')
			}])

			// call handler
			await prop_list_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
			const props = await prop_list_i({})
			expect(props.length === test_data['proposal'].length)
		})

		// sort by name asc
		test('Sort by name asc', async () => {
			const props = await prop_list_i({
				sort: 'proposal_name',
				order: 'ASC'
			})
			expect(props[0].proposal_id).toBe(test_data['proposal']['root_conduct_fail'].id)
		})

		// sort by date_created desc
		test('Sort by date_created desc', async () => {
			const props = await prop_list_i({
				sort: 'date_created',
				order: 'DESC'
			})
			expect(props[0].proposal_id).toBe(test_data['proposal']['root_name_failed'].id)
		})

		// sort by date_updated asc
		test('Sort by date_updated asc', async () => {
			const props = await prop_list_i({
				sort: 'date_updated',
				order: 'ASC'
			})
			expect(props[0].proposal_id).toBe(test_data['proposal']['root_name_failed'].id)
		})

		// limit & last
		test('Limit and last', async() => {
			const props = await prop_list_i({
				sort: 'proposal_name',
				order: 'ASC',
				limit: 1,
				last: test_data['proposal']['root_conduct_fail'].name
			})
			expect(props[0].proposal_id).toBe(test_data['proposal']['gchild_content_close'].id)
			expect(props.length).toBe(1)
		})

		// error: invalid sort
		test('Error: Invalid sort', async() => {
			await expect(prop_list_i({
				sort: 'bad_field'
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid order
		test('Error: Invalid sort', async() => {
			await expect(prop_list_i({
				order: 'bad_val'
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid limit - negative
		test('Error: Invalid negative limit', async() => {
			await expect(prop_list_i({
				sort: 'proposal_name',
				order: 'ASC',
				limit: -1
			})).rejects.toThrow(errors._invalid_query)
		})
		
		// error: invalid limit - string
		test('Error: Invalid string limit', async() => {
			await expect(prop_list_i({
				sort: 'proposal_name',
				order: 'ASC',
				limit: 'bad'
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid last value
		test('Error: Invalid last value', async() => {
			await expect(prop_list_i({
				sort: 'proposal_name',
				order: 'ASC',
				limit: 1,
				last: 1
			})).rejects.toThrow(errors._invalid_query)
		})

		// filter by democracy_id equals
		test('Filter by democracy id equals', async() => {
			const props = await prop_list_i({
				filter: {
					democracy_id: {
						op: "=",
						val: test_data['proposal']['root_name_failed'].democracy_id
					}
				}
			})
			expect(props[0].proposal_id).toBe(test_data['proposal']['root_name_failed'].id)
		})

		// filter by membership_id in list
		test('Filter by membership id in list', async() => {
			const props = await prop_list_i({
				filter: {
					membership_id: {
						op: "IN",
						val: [ test_data['proposal']['root_name_failed'].membership_id ]
					}
				}
			})
			expect(props[0].proposal_id).toBe(test_data['proposal']['root_name_failed'].id)
		})

		// filter by proposal_name not in list
		test('Filter by proposal name not in list', async() => {
			const props = await prop_list_i({
				filter: {
					proposal_name: {
						op: "NOT IN",
						val: [
							test_data['proposal']['root_name_failed'].name,
							test_data['proposal']['child_desc_passed'].name
						]
					}
				}
			})
			expect(props.length).toBe(3)
		})

		// filter by proposal_description contains
		test('Filter by proposal description contains', async() => {
			const props = await prop_list_i({
				filter: {
					proposal_description: {
						op: '~',
						val: 'test'
					}
				}
			})
			expect(props.length).toBe(5)
		})

		// filter by proposal_target not equal
		test('Filter by proposal target not equal', async() => {
			const props = await prop_list_i({
				filter: {
					proposal_target: {
						op: '!=',
						val: 'name'
					}
				}
			})
			expect(props.length).toBe(4)
		})

		// filter by proposal_votable equals
		test('Filter by proposal votable equals', async() => {
			const props = await prop_list_i({
				filter: {
					proposal_votable: {
						op: '=',
						val: true
					}
				}
			})
			expect(props.length).toBe(3)
		})

		// filter by proposal_passed not equal
		test('Filter by proposal votable equals', async() => {
			const props = await prop_list_i({
				filter: {
					proposal_votable: {
						op: '!=',
						val: true
					}
				}
			})
			expect(props.length).toBe(2)
		})

		// filter by date_created greater than
		test('Filter by date created greater than', async() => {
			const props = await prop_list_i({
				filter: {
					date_created: {
						op: '>',
						val: (new Date).toJSON()
					}
				}
			})
			expect(props.length).toBe(0)
		})

		// filter by date_updated less than
		test('Filter by date updated less than', async() => {
			const props = await prop_list_i({
				filter: {
					date_created: {
						op: '<',
						val: (new Date).toJSON()
					}
				}
			})
			expect(props.length).toBe(5)
		})

		// TODO error: invalid filter field
		//test('Error: Invalid filter field', async() => {
		//	await expect(prop_list_i({
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
			await expect(prop_list_i({
				filter: {
					proposal_name: {
						op: 'bad',
						val: 'asdf'
					}
				}
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid filter value
		test('Error: Invalid filter value', async() => {
			await expect(prop_list_i({
				filter: {
					proposal_name: {
						op: '=',
						val: 1
					}
				}
			})).rejects.toThrow(errors._invalid_query)
		})
	})
})
