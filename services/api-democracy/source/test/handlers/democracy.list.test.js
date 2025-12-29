const { errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	democracy_list_unit: dem_list_u,
	democracy_list_integration: dem_list_i } = require('../helper')

describe('Democracy List', () => {

	describe('Unit Tests', () => {

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = {filter:{democracy_parent:'430488ba-7c63-49da-b22d-0435be67f4ef'}}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'pageQuery',
				args: false,
				err: false,
				val: []
			}])
			const dummy_lib = get_dummy_lib([])

			// call handler
			await dem_list_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(200)
			expect(dummy_reply.send).toHaveBeenCalledWith([])

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: db
		test('Error: Database error', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'pageQuery',
				args: false,
				err: new Error('db error')
			}])
			const dummy_lib = get_dummy_lib([])

			// call handler
			await dem_list_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
	})

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		// success: all
		test('List all', async () => {
			const dems = await dem_list_i({})
			expect(dems.length === 3)
		})

		// sort by name asc
		test('Sort by name asc', async () => {
			const dems = await dem_list_i({
				sort: "democracy_name",
				order: "ASC"
			})
			expect(dems[0].id === test_data['democracy']['root']['id'])
		})

		// sort by verified population desc
		test('Sort by verified population desc', async () => {
			const dems = await dem_list_i({
				sort: "democracy_population_verified",
				order: "DESC"
			})
			expect(dems[0].id === test_data['democracy']['root']['id'])
		})

		// sort by unverified population asc
		test('Sort by unverified population asc', async () => {
			const dems = await dem_list_i({
				sort: "democracy_population_unverified",
				order: "ASC"
			})
			expect(dems[0].id === test_data['democracy']['not_root_child']['id'])
		})

		// sort by date created asc
		test('Sort by creation date asc', async () => {
			const dems = await dem_list_i({
				sort: "date_created",
				order: "ASC"
			})
			expect(dems[0].id === test_data['democracy']['root']['id'])
		})

		// sort by date updated desc
		test('Sort by update date desc', async () => {
			const dems = await dem_list_i({
				sort: "date_updated",
				order: "DESC"
			})
			expect(dems[0].id === test_data['democracy']['root']['id'])
		})

		// success: pagination
		test('Limit and last', async () => {
			const dems = await dem_list_i({
				sort: "democracy_name",
				order: "ASC",
				limit: 1,
				last: test_data['democracy']['root']['name']
			})
			expect(dems[0].id === test_data['democracy']['root_child']['id'])
		})

		// error: invalid sort
		test('Error: Invalid sort', async() => {
			await expect(dem_list_i({
				sort: 'bad_val'
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid order
		test('Error: Invalid order', async() => {
			await expect(dem_list_i({
				order: 'bad_val'
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid limit
		test('Error: Invalid limit', async() => {
			await expect(dem_list_i({
				sort: 'democracy_name',
				order: 'ASC',
				limit: -1
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid last value
		test('Error: Invalid last value', async() => {
			await expect(dem_list_i({
				sort: 'democracy_name',
				order: 'ASC',
				limit: 1,
				last: 1
			})).rejects.toThrow(errors._invalid_query)
		})

		// filter by democracy id equals
		test('Filter by id equals', async () => {
			const dems = await dem_list_i({
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

		// filter by democracy name in list
		test('Filter by name in list', async () => {
			const dems = await dem_list_i({
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

		// filter by democracy description contains
		test('Filter by description contains', async () => {
			const dems = await dem_list_i({
				filter: {
					democracy_description: {
						op: "~",
						val: test_data['democracy']['root_child']['description']
					}
				}
			})
			expect(dems.length === 1)
		})

		// filter by verified population not equals
		test('Filter by verified population not equals', async () => {
			const dems = await dem_list_i({
				filter: {
					democracy_population_verified: {
						op: "!=",
						val: 5
					}
				}
			})
			expect(dems.length === 2)
		})

		// filter by unverified population not equals
		test('Filter by unverified population not equals', async () => {
			const dems = await dem_list_i({
				filter: {
					democracy_population_unverified: {
						op: "!=",
						val: 5
					}
				}
			})
			expect(dems.length === 2)
		})

		// filter by date created greater than
		test('Filter by date created greater than', async () => {
			const dems = await dem_list_i({
				filter: {
					date_created: {
						op: ">",
						val: new Date().toJSON()
					}
				}
			})
			expect(dems.length === 0)
		})

		// filter by date updated less than
		test('Filter by date updated less than', async () => {
			const dems = await dem_list_i({
				filter: {
					date_updated: {
						op: "<",
						val: new Date().toJSON()
					}
				}
			})
			expect(dems.length === 3)
		})

		// TODO error: invalid filter field
		//test('Error: Invalid filter value', async() => {
		//	await expect(dem_list_i({
		//		filter: {
		//			bad_val: {
		//				op: '=',
		//				val: 'asdf'
		//			}
		//		}
		//	})).rejects.toThrow(errors._invalid_query)
		//})

		// error: invalid filter op
		test('Error: Invalid filter value', async() => {
			await expect(dem_list_i({
				filter: {
					democracy_name: {
						op: 'bad',
						val: 'asdf'
					}
				}
			})).rejects.toThrow(errors._invalid_query)
		})

		// error: invalid filter value
		test('Error: Invalid filter value', async() => {
			await expect(dem_list_i({
				filter: {
					democracy_name: {
						op: '=',
						val: 1
					}
				}
			})).rejects.toThrow(errors._invalid_query)
		})
	})
})

