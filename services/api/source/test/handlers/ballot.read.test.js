const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	ballot_read_unit: blt_read_u,
	ballot_read_integration: blt_read_i
} = require('../helper')

describe('Ballot Read', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const ballot_id = test_data.ballot.cmp_av_1.id
			const profile = test_data.profile.profile
			const ballot = await blt_read_i(ballot_id, profile.id, profile.auth_token, profile.auth_expiry)
			expect(ballot.ballot_id).toBe(ballot_id)
		})
	})

	describe('Unit Tests', () => {

		const profile_id = get_uuid()
		const proposal_id = get_uuid()
		const membership_id = get_uuid()
		const democracy_id = get_uuid()
		const ballot_id = get_uuid()
		const jwt = JSON.stringify({ profile_id })

		test('Success', async() => {

			// set up mocks
			const dummy_req = { ballot_id, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { democracy_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				val: [{ membership_id }],
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { membership_id, proposal_id },
				err: false
			}], errors)
			
			// call handler
			await blt_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith({membership_id,proposal_id})

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
			
		test('Error: Invalid JWT', async() => {

			// set up mocks
			const dummy_req = { ballot_id, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: errors.invalid_auth,
				err: true
			},{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { democracy_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				val: [{ membership_id }],
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { membership_id, proposal_id },
				err: false
			}], errors)
			
			// call handler
			await blt_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(401)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Invalid Profile', async() => {

			// set up mocks
			const dummy_req = { ballot_id, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: {},
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { democracy_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				val: [{ membership_id }],
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { membership_id, proposal_id },
				err: false
			}], errors)
			
			// call handler
			await blt_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(401)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		test('Error: Invalid membership', async() => {

			// set up mocks
			const dummy_req = { ballot_id, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { democracy_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				val: [],
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { membership_id, proposal_id },
				err: false
			}], errors)
			
			// call handler
			await blt_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(401)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
	
		test('Error: Duplicate auth', async() => {

			// set up mocks
			const dummy_req = { ballot_id, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { democracy_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				val: [{}, {}],
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { membership_id, proposal_id },
				err: false
			}], errors)
			
			// call handler
			await blt_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Invalid Membership', async() => {

			// set up mocks
			const dummy_req = { ballot_id, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { democracy_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				val: [{ membership_id: get_uuid() }],
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { membership_id, proposal_id },
				err: false
			}], errors)
			
			// call handler
			await blt_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(401)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: No Ballot', async() => {

			// set up mocks
			const dummy_req = { ballot_id, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: errors.ballot_dne,
				err: true
			}], errors)
			
			// call handler
			await blt_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.ballot_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
			
		test('Error: Proposal DNE', async() => {

			// set up mocks
			const dummy_req = { ballot_id, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { proposal_id },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: errors.proposal_dne,
				err: true
			}], errors)
			
			// call handler
			await blt_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.proposal_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: Internal error', async() => {

			// set up mocks
			const dummy_req = { ballot_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				val: { profile_id },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: errors.internal_error,
				err: true
			}], errors)
			
			// call handler
			await blt_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

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
