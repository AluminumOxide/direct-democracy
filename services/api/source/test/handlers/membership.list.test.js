const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_api,
	integration_test_setup,
	membership_list_unit: mem_list_u,
	membership_list_integration: mem_list_i
} = require('../helper')

describe('Membership List', () => {

	describe('Integration Tests', () => {
	
		const test_data = integration_test_setup()

		test('Success', async() => {
			const mems = await mem_list_i({
				profile_id: test_data['membership']['verified_root_1'].profile_id
			})
			expect(mems.length).toBe(1)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { filter: {} }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('membership', [{
				fxn: 'membership_list',
				val: dummy_req,
				err: false
			}])
			
			// call handler
			await mem_list_u(dummy_req, dummy_reply, {}, dummy_log)

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
			get_dummy_api('membership', [{
				fxn: 'membership_list',
				val: new Error(errors.internal_error),
				err: true
			}])
			
			// call handler
			await mem_list_u(dummy_req, dummy_reply, {}, dummy_log)

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
