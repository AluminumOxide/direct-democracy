const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_api,
	integration_test_setup,
	ballot_create_unit: blt_create_u,
	ballot_create_integration: blt_create_i
} = require('../helper')

describe('Ballot Create', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const test_blt = {
				profile_id: test_data.membership.unverified_child_4.id,
				proposal_id: test_data.proposal.child_metas_pass.id,
				ballot_approved: true,
				ballot_comments: 'asdfasdfasf'
			}
			const { profile_id, ...expected } = test_blt
			await expect(blt_create_i(test_blt)).resolves.toMatchObject(expected)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {},
				err: false
			},{
				fxn: 'ballot_create',
				val: dummy_req,
				err: false
			}])
			
			// call handler
			await blt_create_u(dummy_req, dummy_reply, {}, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(201)
			expect(dummy_reply.send).toBeCalledWith(dummy_req)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Membership DNE', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {},
				err: false
			},{
				fxn: 'ballot_create',
				val: new Error(errors.membership_dne),
				err: true
			}])
			
			// call handler
			await blt_create_u(dummy_req, dummy_reply, {}, dummy_log)

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
			const dummy_req = { democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {},
				err: false
			},{
				fxn: 'ballot_create',
				val: new Error(errors.proposal_dne),
				err: true
			}])
			
			// call handler
			await blt_create_u(dummy_req, dummy_reply, {}, dummy_log)

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
			const dummy_req = { democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {},
				err: false
			},{
				fxn: 'ballot_create',
				val: new Error(errors.voting_closed),
				err: true
			}])
			
			// call handler
			await blt_create_u(dummy_req, dummy_reply, {}, dummy_log)

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
			const dummy_req = { democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {},
				err: false
			},{
				fxn: 'ballot_create',
				val: new Error(errors.internal_error),
				err: true
			}])
			
			// call handler
			await blt_create_u(dummy_req, dummy_reply, {}, dummy_log)

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
