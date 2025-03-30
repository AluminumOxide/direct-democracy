const { errors,
	integration_test_setup,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	democracy_root_unit: dem_root_u,
	democracy_root_integration: dem_root_i } = require('../helper')

describe('Democracy Root', () => {
	describe('Unit Tests', () => {

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'whereNull',
				args: ['democracy.parent_id'],
				err: false,
				val: [dummy_req]
			}])
			const dummy_lib = get_dummy_lib([])

			// call handler
			await dem_root_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith(dummy_req)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: no root
		test('Error: No root', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'whereNull',
				args: ['democracy.parent_id'],
				err: false,
				val: []
			}])
			const dummy_lib = get_dummy_lib([])

			// call handler
			await dem_root_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'whereNull',
				args: ['democracy.parent_id'],
				err: new Error('db error')
			}])
			const dummy_lib = get_dummy_lib([])

			// call handler
			await dem_root_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toBeCalledWith(500)
			

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		// success
		test('Success', async () => {
			const expected = test_data['democracy']['root']
			const actual = await dem_root_i()
			expect(actual.democracy_id).toBe(expected.id)
			expect(actual.democracy_name).toBe(expected.name)
			expect(actual.democracy_description).toBe(expected.description)
			expect(actual.democracy_conduct).toEqual(expected.conduct)
			expect(actual.democracy_content).toEqual(expected.content)
			expect(actual.democracy_metas).toEqual(expected.metas)
			expect(Object.keys(actual)).toEqual(expect.arrayContaining(['democracy_population_verified','democracy_population_unverified','date_created','date_updated']))
		})
	})
})
