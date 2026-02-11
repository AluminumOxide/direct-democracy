const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	membership_verify_unit: mem_verify_u,
	membership_read_integration: mem_read_i,
	membership_verify_integration: mem_verify_i
} = require('../helper')

describe('Membership Verify', () => {

	describe('Integration Tests', () => {
		
		const test_data = integration_test_setup()

		test('Success', async () => {
			const mem = test_data.membership.unverified_root_1
			const pro = test_data.profile.profile
			const ver = await mem_verify_i(mem.id, 'test', pro.id, pro.auth_token, pro.auth_expiry)
			const mem2 = await mem_read_i(mem.id, pro.id, pro.auth_token, pro.auth_expiry)
			expect(ver.proposal_id).toBeDefined()
			expect(!!mem2.verifying)
			expect(!mem2.verified)
		})
		
		test('Error: Timeout', async () => {
			const mem = test_data.membership.verified_child_1
			const pro = test_data.profile.profile
			await expect(mem_verify_i(mem.id, 'test', pro.id, pro.auth_token, pro.auth_expiry))
				.rejects.toThrow(new Error(errors.membership_timeout))
		})
	})

	describe('Unit Tests', () => {

		const profile_id = get_uuid()
		const democracy_id = get_uuid()
		const membership_id = get_uuid()
		const jwt = JSON.stringify({ profile_id })
		const description  = 'test'

		test('Success', async () => {

			// set up mocks
			const dummy_req = {jwt, membership_id, description}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { profile_id, democracy_id, is_verified: false, is_verifying: false },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'proposal_create',
				val: {},
				err: false
			}], errors)
			
			// call handler
			await mem_verify_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(200)
			expect(dummy_reply.send).toHaveBeenCalledWith({})

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Invalid JWT', async () => {

			// set up mocks
			const dummy_req = {jwt, membership_id, description}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: errors.invalid_auth,
				err: true
			}], errors)
			
			// call handler
			await mem_verify_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(401)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid membership', async () => {

			// set up mocks
			const dummy_req = {jwt, membership_id, description}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: errors.membership_dne,
				err: true
			}], errors)
			
			// call handler
			await mem_verify_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_dne))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Invalid profile', async () => {

			// set up mocks
			const dummy_req = {jwt, membership_id, description}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { profile_id:'bad', democracy_id, is_verified: false, is_verifying: false },
				err: false
			}], errors)
			
			// call handler
			await mem_verify_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(401)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Membership already verified', async () => {

			// set up mocks
			const dummy_req = {jwt, membership_id, description}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { profile_id, democracy_id, is_verified: true, is_verifying: false },
				err: false
			}], errors)
			
			// call handler
			await mem_verify_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_verified))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Membership already verifying', async () => {

			// set up mocks
			const dummy_req = {jwt, membership_id, description}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { profile_id, democracy_id, is_verified: false, is_verifying: true },
				err: false
			}], errors)
			
			// call handler
			await mem_verify_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_verified))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Membership in timeout', async () => {

			// set up mocks
			const dummy_req = {jwt, membership_id, description}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { profile_id, democracy_id, is_verified: false, is_verifying: false, timeout_end:'2100-01-01T00:00:00.000Z' },
				err: false
			}], errors)
			
			// call handler
			await mem_verify_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_timeout))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Internal error', async () => {

			// set up mocks
			const dummy_req = {jwt, membership_id, description}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: errors.internal_error,
				err: true
			}], errors)
			
			// call handler
			await mem_verify_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

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
