const { errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	reset_test_data,
	democracy_list_unit: dem_list_u,
	democracy_list_integration: dem_list_i } = require('../helper')

describe('Democracy List', () => {

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
			await dem_list_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
			await dem_list_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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

		// success: all
		test('List all', async () => {
			const test_data = await reset_test_data()
			const dems = await dem_list_i({})
			expect(dems.length === 3)
		})

		// success: sorting
		test('Sort by name asc', async () => {
			const test_data = await reset_test_data()
			const dems = await dem_list_i({
				sort: "democracy_name",
				order: "ASC"
			})
			expect(dems[0].id === test_data['democracy']['root']['id'])
		})
		test('Sort by verified population desc', async () => {
			const test_data = await reset_test_data()
			const dems = await dem_list_i({
				sort: "democracy_population_verified",
				order: "DESC"
			})
			expect(dems[0].id === test_data['democracy']['root']['id'])
		})
		test('Sort by unverified population asc', async () => {
			const test_data = await reset_test_data()
			const dems = await dem_list_i({
				sort: "democracy_population_unverified",
				order: "ASC"
			})
			expect(dems[0].id === test_data['democracy']['not_root_child']['id'])
		})
		test('Sort by creation date asc', async () => {
			const test_data = await reset_test_data()
			const dems = await dem_list_i({
				sort: "date_created",
				order: "ASC"
			})
			expect(dems[0].id === test_data['democracy']['root']['id'])
		})
		test('Sort by update date desc', async () => {
			const test_data = await reset_test_data()
			const dems = await dem_list_i({
				sort: "date_updated",
				order: "DESC"
			})
			expect(dems[0].id === test_data['democracy']['root']['id'])
		})
		// TODO error: invalid sort
		// TODO error: invalid order

		// success: filters
		test('Filter by id equals', async () => {
			const test_data = await reset_test_data()
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
		test('Filter by name in list', async () => {
			const test_data = await reset_test_data()
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
		test('Filter by description contains', async () => {
			const test_data = await reset_test_data()
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
		test('Filter by verified population not equals', async () => {
			const test_data = await reset_test_data()
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
		test('Filter by unverified population not equals', async () => {
			const test_data = await reset_test_data()
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
		test('Filter by date created greater than', async () => {
			const test_data = await reset_test_data()
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
		test('Filter by date updated less than', async () => {
			const test_data = await reset_test_data()
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
		// TODO error: invalid filter op
		// TODO error: invalid filter value

		// success: pagination
		test('Limit and last', async () => {
			const test_data = await reset_test_data()
			const dems = await dem_list_i({
				sort: "democracy_name",
				order: "ASC",
				limit: 1,
				last: test_data['democracy']['root']['name']
			})
			expect(dems[0].id === test_data['democracy']['root_child']['id'])
		})

		// TODO error: invalid limit
		// TODO error: invalid sort
		// TODO error: invalid order
		// TODO error: invalid last value
		// TODO error: pagination without sort

	})
})

