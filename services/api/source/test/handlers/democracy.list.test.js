const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_api,
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
			get_dummy_api('democracy', [{
				fxn: 'democracy_list',
				val: dummy_req,
				err: false
			}])
			
			// call handler
			await dem_list_u(dummy_req, dummy_reply, {}, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith(dummy_req)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Internal error', async() => {

			// set up mocks
			const dummy_req = { }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('democracy', [{
				fxn: 'democracy_list',
				val: new Error(errors.internal_error),
				err: true
			}])
			
			// call handler
			await dem_list_u(dummy_req, dummy_reply, {}, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})
})
