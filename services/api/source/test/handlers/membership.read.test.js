const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	membership_read_unit: mem_read_u,
	membership_read_integration: mem_read_i
} = require('../helper')

describe('Membership Read', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const expected = test_data['membership']['verified_root_1']
			const actual = await mem_read_i(expected.id, expected.profile_id)
			expect(actual.membership_id).toBe(expected.id)
			expect(actual.profile_id).toBe(expected.profile_id)
		})
	})

	describe('Unit Tests', () => {

		const profile_id = get_uuid()
		const jwt = JSON.stringify({ profile_id })

		test('Success', async() => {

			// set up mocks
			const dummy_req = { membership_id: get_uuid(), profile_id, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: dummy_req,
				err: false
			}], errors)
			
			// call handler
			await mem_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith(dummy_req)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Invalid profile ID', async() => {

			// set up mocks
			const dummy_req = { membership_id: get_uuid(), profile_id: get_uuid(), jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { profile_id: get_uuid() },
				err: false
			}], errors)
			
			// call handler
			await mem_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(401)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Democracy DNE', async() => {

			// set up mocks
			const dummy_req = { membership_id: get_uuid(), profile_id, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: errors.membership_dne,
				err: true
			}], errors)
			
			// call handler
			await mem_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.membership_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Internal error', async() => {

			// set up mocks
			const dummy_req = { membership_id: get_uuid(), profile_id, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: errors.internal_error,
				err: true
			}], errors)
			
			// call handler
			await mem_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

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
