const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	ballot_update_unit: blt_update_u,
	ballot_update_integration: blt_update_i
} = require('../helper')

describe('Ballot Update', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const profile_id = test_data.membership.verified_child_2.profile_id
			const ballot = {
				ballot_id: test_data.ballot.cmp_av_2.id,
				ballot_approved: false,
				ballot_comments: 'qwerawer'
			}
			await expect(blt_update_i(ballot.ballot_id, ballot.ballot_approved, ballot.ballot_comments, profile_id)).resolves.toMatchObject(ballot)
		})
	})

	describe('Unit Tests', () => {

		const ballot_id = get_uuid()
		const proposal_id = get_uuid()
		const membership_id = get_uuid()
		const democracy_id = get_uuid()
		const profile_id = get_uuid()
		const jwt = JSON.stringify({ profile_id })

		test('Success', async() => {

			// set up mocks
			const dummy_req = { ballot_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_update',
				val: { membership_id, proposal_id },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { proposal_id, membership_id },
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
			}], errors)
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith({ membership_id, proposal_id })

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: No ballot', async() => {

			// set up mocks
			const dummy_req = { ballot_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: errors.ballot_dne,
				err: true
			}], errors)
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.ballot_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: No membership', async() => {

			// set up mocks
			const dummy_req = { ballot_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { proposal_id, membership_id },
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
			}], errors)
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(401)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Bad membership', async() => {

			// set up mocks
			const dummy_req = { ballot_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { proposal_id, membership_id },
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
			}], errors)
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Multiple memberships', async() => {

			// set up mocks
			const dummy_req = { ballot_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { proposal_id, membership_id },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { democracy_id },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				val: [{},{}],
				err: false
			}], errors)
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		test('Error: Ballot DNE', async() => {

			// set up mocks
			const dummy_req = { ballot_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: errors.ballot_dne,
				err: true
			}], errors)
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

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
			const dummy_req = { ballot_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { proposal_id, membership_id },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: errors.proposal_dne,
				err: true
			}], errors)
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.proposal_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Membership DNE', async() => {

			// set up mocks
			const dummy_req = { ballot_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: errors.membership_dne,
				err: true
			}], errors)
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(401)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Ballot closed', async() => {

			// set up mocks
			const dummy_req = { ballot_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_update',
				val: errors.ballot_closed,
				err: true
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { proposal_id, membership_id },
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
			}], errors)
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.ballot_closed))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Voting closed', async() => {

			// set up mocks
			const dummy_req = { ballot_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_update',
				val: errors.voting_closed,
				err: true
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { proposal_id, membership_id },
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
			}], errors)
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.voting_closed))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Internal error', async() => {

			// set up mocks
			const dummy_req = { ballot_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: errors.interal_error,
				err: true
			}], errors)
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

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
