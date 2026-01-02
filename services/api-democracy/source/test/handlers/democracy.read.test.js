const {
	errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_lib,
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
				fxn: 'where',
				args: ['democracy.id', dummy_req.democracy_id],
				err: false,
				val: [dummy_req]
			}])
			const dummy_lib = get_dummy_lib([])

			// call handler
			await dem_read_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(200)
			expect(dummy_reply.send).toHaveBeenCalledWith(dummy_req)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)

		})

		// error: no democracy
		test('Error: Democracy dne', async() => {

			// set up mocks
			const dummy_req = {democracy_id: '9cc71698-5845-4186-8620-2efb1cecc964'}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: ['democracy.id', dummy_req.democracy_id],
				err: false,
				val: []
			}])
			const dummy_lib = get_dummy_lib([])

			// call handler
			await dem_read_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.democracy_dne))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: db
		test('Error: Database error', async() => {

			// set up mocks
			const dummy_req = {democracy_id: '9cc71698-5845-4186-8620-2efb1cecc964'}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: ['democracy.id', dummy_req.democracy_id],
				err: new Error('db error')
			}])
			const dummy_lib = get_dummy_lib([])

			// call handler
			await dem_read_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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

		// success: read no parent
		test('Success: No parent', async () => {
			const expected = test_data['democracy']['root']
			const actual = await dem_read_i(expected.id)
			expect(actual.democracy_id).toBe(expected.id)
			expect(actual.democracy_name).toBe(expected.democracy_name)
			expect(actual.democracy_description).toBe(expected.democracy_description)
			expect(actual.democracy_conduct).toEqual(expected.democracy_conduct)
			expect(actual.democracy_content).toEqual(expected.democracy_content)
			expect(actual.democracy_metas).toEqual(expected.democracy_metas)
			expect(actual.democracy_parent.id).toBeNull()
			expect(actual.democracy_children).toEqual([{'id':test_data['democracy']['root_child']['id'],'name':test_data['democracy']['root_child']['democracy_name']}])
			expect(Object.keys(actual)).toEqual(expect.arrayContaining(['democracy_population_verified','democracy_population_unverified','date_created','date_updated']))
		})

		// success: read parent and child
		test('Success: Parent & children', async () => {
			const expected = test_data['democracy']['root_child']
			const actual = await dem_read_i(expected.id)
			expect(actual.democracy_id).toBe(expected.id)
			expect(actual.democracy_name).toBe(expected.democracy_name)
			expect(actual.democracy_description).toBe(expected.democracy_description)
			expect(actual.democracy_conduct).toEqual(expected.democracy_conduct)
			expect(actual.democracy_content).toEqual(expected.democracy_content)
			expect(actual.democracy_metas).toEqual(expected.democracy_metas)
			expect(actual.democracy_parent.id).toBe(expected.parent_id)
			expect(actual.democracy_children).toEqual([{'id':test_data['democracy']['not_root_child']['id'],'name':test_data['democracy']['not_root_child']['democracy_name']}])
			expect(Object.keys(actual)).toEqual(expect.arrayContaining(['democracy_population_verified','democracy_population_unverified','date_created','date_updated']))
		})

		// success: read no children
		test('Success: No children', async () => {
			const expected = test_data['democracy']['not_root_child']
			const actual = await dem_read_i(expected.id)
			expect(actual.democracy_id).toBe(expected.id)
			expect(actual.democracy_name).toBe(expected.democracy_name)
			expect(actual.democracy_description).toBe(expected.democracy_description)
			expect(actual.democracy_conduct).toEqual(expected.democracy_conduct)
			expect(actual.democracy_content).toEqual(expected.democracy_content)
			expect(actual.democracy_metas).toEqual(expected.democracy_metas)
			expect(actual.democracy_parent.id).toBe(expected.parent_id)
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
