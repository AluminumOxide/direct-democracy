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
			const proposal = test_data.proposal.child_desc_passed
			const blts = await blt_list_i(proposal.id, 'yes')
			expect(blts.length).toBe(2)
		})
	})

	describe('Unit Tests', () => {

		test('Success: Ballots', async() => {

			// set up mocks
			const id = get_uuid()
			const dummy_req = { proposal_id: get_uuid(), ballot_approved: 'yes' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_list',
				val: [{ ballot_id: id, ballot_comments: 'test' }],
				err: false
			}], errors)
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(200)
			expect(dummy_reply.send).toHaveBeenCalledWith([{id,comments:'test'}])

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Success: No ballots', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid(), ballot_approved: 'yes' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_list',
				val: false,
				err: false
			}], errors)
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(200)
			expect(dummy_reply.send).toHaveBeenCalledWith([])

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: List failure', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid(), ballot_approved: 'yes' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_list',
				val: errors.internal_error,
				err: true
			}], errors)
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

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
