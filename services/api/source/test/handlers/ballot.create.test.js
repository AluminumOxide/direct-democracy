const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	ballot_create_unit: blt_create_u,
	ballot_create_integration: blt_create_i
} = require('../helper')

describe('Ballot Create', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const test_blt = {
				jwt: JSON.stringify({profile_id: test_data.membership.unverified_child_4.profile_id}),
				proposal_id: test_data.proposal.child_metas_pass.id,
				ballot_approved: true,
				ballot_comments: 'asdfasdfasf'
			}
			const { jwt, ...expected } = test_blt
			await expect(blt_create_i(test_blt)).resolves.toMatchObject(expected)
		})
	})

	describe('Unit Tests', () => {

		const profile_id = get_uuid()
		const proposal_id = get_uuid()
		const membership_id = get_uuid()
		const democracy_id = get_uuid()
		const jwt = JSON.stringify({ profile_id })

		test('Success', async() => {

			// set up mocks
			const dummy_req = { proposal_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
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
				fxn: 'ballot_create',
				val: { membership_id, proposal_id },
				err: false
			}], errors)
			
			// call handler
			await blt_create_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(201)
			expect(dummy_reply.send).toBeCalledWith({ membership_id, proposal_id })

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: No Membership', async() => {

			// set up mocks
			const dummy_req = { proposal_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
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
			await blt_create_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(401)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Multiple Membership', async() => {

			// set up mocks
			const dummy_req = { proposal_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
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
			await blt_create_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		test('Error: Membership DNE', async() => {

			// set up mocks
			const dummy_req = { proposal_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
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
				fxn: 'ballot_create',
				val: errors.membership_dne,
				err: true
			}], errors)
			
			// call handler
			await blt_create_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(401)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
			
		test('Error: Invalid proposal', async() => {

			// set up mocks
			const dummy_req = { proposal_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
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
				fxn: 'ballot_create',
				val: errors.proposal_dne,
				err: true
			}], errors)
			
			// call handler
			await blt_create_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.proposal_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: Voting closed', async() => {

			// set up mocks
			const dummy_req = { proposal_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
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
				fxn: 'ballot_create',
				val: errors.voting_closed,
				err: true
			}], errors)
			
			// call handler
			await blt_create_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.voting_closed))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: Internal error', async() => {

			// set up mocks
			const dummy_req = { proposal_id, ballot_approved: true, jwt }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: errors.internal_error,
				err: true
			}], errors)
			
			// call handler
			await blt_create_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

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
