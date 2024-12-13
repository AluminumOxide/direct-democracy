const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_api,
	integration_test_setup,
	ballot_update_unit: blt_update_u,
	ballot_update_integration: blt_update_i
} = require('../helper')

describe('Ballot Update', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const profile_id = test_data.ballot.cmp_av_2.membership_id
			const ballot = {
				ballot_id: test_data.ballot.cmp_av_2.id,
				ballot_approved: false,
				ballot_comments: 'qwerawer'
			}
			await expect(blt_update_i({ profile_id, ...ballot })).resolves.toMatchObject(ballot)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid(), democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'ballot_update',
				val: dummy_req,
				err: false
			},{
				fxn: 'ballot_read',
				val: dummy_req,
				err: false
			}])
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith(dummy_req)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: No ballot', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid(), democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'ballot_read',
				val: new Error(errors.ballot_dne),
				err: true
			}])
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.ballot_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Invalid membership', async() => {

			// set up mocks
			const dummy_req = { ballot_id: get_uuid(), profile_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'ballot_read',
				val: { membership_id: get_uuid() },
				err: false
			}])
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(401)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: Ballot DNE', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid(), democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'ballot_update',
				val: new Error(errors.ballot_dne),
				err: true
			},{
				fxn: 'ballot_read',
				val: dummy_req,
				err: false
			}])
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log)

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
			const dummy_req = { proposal_id: get_uuid(), democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'ballot_update',
				val: new Error(errors.proposal_dne),
				err: true
			},{
				fxn: 'ballot_read',
				val: dummy_req,
				err: false
			}])
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log)

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
			const dummy_req = { proposal_id: get_uuid(), democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'ballot_update',
				val: new Error(errors.membership_dne),
				err: true
			},{
				fxn: 'ballot_read',
				val: dummy_req,
				err: false
			}])
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log)

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
			const dummy_req = { proposal_id: get_uuid(), democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'ballot_update',
				val: new Error(errors.ballot_closed),
				err: true
			},{
				fxn: 'ballot_read',
				val: dummy_req,
				err: false
			}])
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log)

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
			const dummy_req = { proposal_id: get_uuid(), democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'ballot_update',
				val: new Error(errors.voting_closed),
				err: true
			},{
				fxn: 'ballot_read',
				val: dummy_req,
				err: false
			}])
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log)

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
			const dummy_req = { proposal_id: get_uuid(), democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'ballot_update',
				val: new Error(errors.internal_error),
				err: true
			},{
				fxn: 'ballot_read',
				val: dummy_req,
				err: false
			}])
			
			// call handler
			await blt_update_u(dummy_req, dummy_reply, {}, dummy_log)

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
