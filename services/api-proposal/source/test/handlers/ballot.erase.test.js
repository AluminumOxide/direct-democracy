const {
	errors,
	get_uuid,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	integration_test_setup,
	ballot_erase_unit: blt_erase_u,
	ballot_read_integration: blt_read_i,
	ballot_erase_integration: blt_erase_i
} = require('../helper')

describe('Ballot Erase', () => {

	describe('Unit Tests', () => {
	
		test('Success', async () => {

			// set up mocks
			const dummy_req = {  ballot_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
			        fxn: 'returning',
			        args: ['*'],
			        err: false,
			        val: [{}]
			}])
			
			// call handler
			await blt_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(204)
			expect(dummy_reply.send).toHaveBeenCalledWith()
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Ballot DNE', async () => {

			// set up mocks
			const dummy_req = {  ballot_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
			        fxn: 'returning',
			        args: ['*'],
			        err: false,
			        val: []
			}])
			
			// call handler
			await blt_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.ballot_dne))
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: DB Error', async () => {

			// set up mocks
			const dummy_req = {  ballot_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
			        fxn: 'returning',
			        args: ['*'],
			        err: true,
			        val: errors.internal_error
			}])
			
			// call handler
			await blt_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
	})

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success: Comments', async () => {
			const old_ballot = test_data.ballot.cdp_av_2
			await blt_erase_i(old_ballot.id)
			const new_ballot = await blt_read_i(old_ballot.proposal_id, old_ballot.membership_id)
			expect(new_ballot.ballot_comments).toBe('')
		})
		
		test('Success: No comments', async () => {
			const old_ballot = test_data.ballot.cdp_av_1
			await blt_erase_i(old_ballot.id)
			const new_ballot = await blt_read_i(old_ballot.proposal_id, old_ballot.membership_id)
			expect(new_ballot.ballot_comments).toBe('')
		})
		
		test('Error: Ballot DNE', async () => {
			await expect(blt_erase_i(get_uuid())).rejects.toThrow(new Error(errors.ballot_dne))
		})
	})
})
