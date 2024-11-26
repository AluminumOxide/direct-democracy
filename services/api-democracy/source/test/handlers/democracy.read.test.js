const {
	errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	integration_test_setup,
	democracy_read_integration: dem_read_i,
	democracy_read_unit: dem_read_u
} = require('../helper')

describe('Democracy Read', () => {

	describe('Unit Tests', () => {

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = {democracy_id: '9cc71698-5845-4186-8620-2efb1cecc964'}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: ['democracy.id', dummy_req.democracy_id],
				throws_error: false,
				last_val: [dummy_req]
			}])

			// call handler
			await dem_read_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith(dummy_req)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)

		})

		// error: no democracy
		test('Error: Democracy dne', async() => {

			// set up mocks
			const dummy_req = {democracy_id: '9cc71698-5845-4186-8620-2efb1cecc964'}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: ['democracy.id', dummy_req.democracy_id],
				throws_error: false,
				last_val: []
			}])

			// call handler
			await dem_read_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.democracy_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: db
		test('Error: Database error', async() => {

			// set up mocks
			const dummy_req = {democracy_id: '9cc71698-5845-4186-8620-2efb1cecc964'}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: ['democracy.id', dummy_req.democracy_id],
				throws_error: new Error('db error')
			}])

			// call handler
			await dem_read_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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

		// success: read no parent
		test('Success: No parent', async () => {
			const expected = test_data['democracy']['root']
			const actual = await dem_read_i(expected.id)
			expect(actual.democracy_id).toBe(expected.id)
			expect(actual.democracy_name).toBe(expected.name)
			expect(actual.democracy_description).toBe(expected.description)
			expect(actual.democracy_conduct).toEqual(expected.conduct)
			expect(actual.democracy_content).toEqual(expected.content)
			expect(actual.democracy_metas).toEqual(expected.metas)
			expect(actual.democracy_parent).toBeNull()
			expect(actual.democracy_children).toEqual([test_data['democracy']['root_child']['id']])
			expect(Object.keys(actual)).toEqual(expect.arrayContaining(['democracy_population_verified','democracy_population_unverified','date_created','date_updated']))
		})

		// success: read parent and child
		test('Success: Parent & children', async () => {
			const expected = test_data['democracy']['root_child']
			const actual = await dem_read_i(expected.id)
			expect(actual.democracy_id).toBe(expected.id)
			expect(actual.democracy_name).toBe(expected.name)
			expect(actual.democracy_description).toBe(expected.description)
			expect(actual.democracy_conduct).toEqual(expected.conduct)
			expect(actual.democracy_content).toEqual(expected.content)
			expect(actual.democracy_metas).toEqual(expected.metas)
			expect(actual.democracy_parent).toBe(expected.parent_id)
			expect(actual.democracy_children).toEqual([test_data['democracy']['not_root_child']['id']])
			expect(Object.keys(actual)).toEqual(expect.arrayContaining(['democracy_population_verified','democracy_population_unverified','date_created','date_updated']))
		})

		// success: read no children
		test('Success: No children', async () => {
			const expected = test_data['democracy']['not_root_child']
			const actual = await dem_read_i(expected.id)
			expect(actual.democracy_id).toBe(expected.id)
			expect(actual.democracy_name).toBe(expected.name)
			expect(actual.democracy_description).toBe(expected.description)
			expect(actual.democracy_conduct).toEqual(expected.conduct)
			expect(actual.democracy_content).toEqual(expected.content)
			expect(actual.democracy_metas).toEqual(expected.metas)
			expect(actual.democracy_parent).toBe(expected.parent_id)
			expect(actual.democracy_children).toBeNull()
			expect(Object.keys(actual)).toEqual(expect.arrayContaining(['democracy_population_verified','democracy_population_unverified','date_created','date_updated']))
		})

		// error: no id
		test('Error: No id', async () => {
			await expect(dem_read_i()).rejects
				.toThrow(Error) // TODO: real error
		})

		// error: non-uuid id
		test('Error: Non-uuid id', async () => {
			await expect(dem_read_i('asdfasdf')).rejects
				.toThrow(Error)
		})

		// TODO: error: invalid id
		test('Error: Invalid id', async () => {
			await expect(dem_read_i('fa688244-ebce-40cb-8f39-2a82d1417519')).rejects
				.toThrow(errors.democracy_dne)
		})
	})
})
