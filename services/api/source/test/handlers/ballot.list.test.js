const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	ballot_list_unit: blt_list_u,
	ballot_list_integration: blt_list_i
} = require('../helper')

describe('Ballot List', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const blts = await blt_list_i(test_data.membership.unverified_root_1.profile_id)
			expect(blts.length).toBe(2)
		})
	})

	describe('Unit Tests', () => {

		const jwt = '{"profile_id":"00000000-0000-0000-0000-000000000000"}'
		test('Success', async() => {

			// set up mocks
			const dummy_req = { filter: {}, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_list',
				val: [{ membership_id: get_uuid() }],
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_list',
				val: [],
				err: false
			}], errors)
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith([])

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Internal error', async() => {

			// set up mocks
			const dummy_req = { jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_list',
				val: errors.internal_error,
				err: true
			}], errors)
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

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
