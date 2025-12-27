const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	democracy_list_unit: dem_list_u,
	democracy_list_integration: dem_list_i
} = require('../helper')

describe('Democracy List', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const dems = await dem_list_i({})
			expect(dems.length).toBe(Object.keys(test_data['democracy']).length)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_list',
				val: dummy_req,
				err: false
			}], errors)
			
			// call handler
			await dem_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(200)
			expect(dummy_reply.send).toHaveBeenCalledWith(dummy_req)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Internal error', async() => {

			// set up mocks
			const dummy_req = { }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_list',
				val: errors.internal_error,
				err: true
			}], errors)
			
			// call handler
			await dem_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
	})
})
