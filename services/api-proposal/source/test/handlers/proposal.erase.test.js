const {
	errors,
	get_uuid,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	integration_test_setup,
	proposal_erase_unit: prop_erase_u,
	proposal_read_integration: prop_read_i,
	proposal_erase_integration: prop_erase_i
} = require('../helper')

describe('Proposal Erase', () => {

	describe('Unit Tests', () => {
	
		test('Success: Name', async () => {

			// set up mocks
			const dummy_req = {  proposal_id: get_uuid(), erase_field: 'name', erase_keys: [] }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				err: false,
				val: {}
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
			        fxn: 'where',
			        err: false,
			        val: [{}]
			}])
			
			// call handler
			await prop_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(204)
			expect(dummy_reply.send).toHaveBeenCalledWith()
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Success: Description', async () => {

			// set up mocks
			const dummy_req = {  proposal_id: get_uuid(), erase_field: 'description', erase_keys: [] }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				err: false,
				val: {}
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
			        fxn: 'where',
			        err: false,
			        val: [{}]
			}])
			
			// call handler
			await prop_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(204)
			expect(dummy_reply.send).toHaveBeenCalledWith()
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Success: Changes', async () => {

			// set up mocks
			const dummy_req = {  proposal_id: get_uuid(), erase_field: 'changes', erase_keys: [] }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				err: false,
				val: {}
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
			        fxn: 'where',
			        err: false,
			        val: [{}]
			}])
			
			// call handler
			await prop_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(204)
			expect(dummy_reply.send).toHaveBeenCalledWith()
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Proposal DNE', async () => {

			// set up mocks
			const dummy_req = {  proposal_id: get_uuid(), erase_field: 'name', erase_keys: []  }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				err: true,
				val: errors.proposal_dne
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			
			// call handler
			await prop_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.proposal_dne))
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid field', async () => {

			// set up mocks
			const dummy_req = {  proposal_id: get_uuid(), erase_field: 'bad', erase_keys: [] }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				err: false,
				val: {}
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			
			// call handler
			await prop_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.target_invalid))
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: DB Error', async () => {

			// set up mocks
			const dummy_req = {  proposal_id: get_uuid(), erase_field: 'name', erase_keys: [] }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				err: false,
				val: {}
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
			        fxn: 'where',
			        err: true,
			        val: errors.internal_error
			}])
			
			// call handler
			await prop_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
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

		test('Success: Name', async () => {
			const old_proposal = test_data.proposal.root_name_failed
			await prop_erase_i(old_proposal.id, 'name', [])
			const new_proposal = await prop_read_i(old_proposal.id)
			expect(new_proposal.proposal_name).toBe(`Name erased for misconduct ${old_proposal.id}`)
			expect(new_proposal.proposal_votable).toBe(false)
			expect(new_proposal.proposal_passed).toBe(false)
		})
		
		test('Success: Description', async () => {
			const old_proposal = test_data.proposal.root_name_failed
			await prop_erase_i(old_proposal.id, 'description', [])
			const new_proposal = await prop_read_i(old_proposal.id)
			expect(new_proposal.proposal_description).toBe(`Description erased for misconduct`)
			expect(new_proposal.proposal_votable).toBe(false)
			expect(new_proposal.proposal_passed).toBe(false)
		})
		
		test('Success: Changes', async () => {
			const old_proposal = test_data.proposal.root_name_failed
			await prop_erase_i(old_proposal.id, 'changes', [])
			const new_proposal = await prop_read_i(old_proposal.id)
			expect(new_proposal.proposal_changes).toMatchObject({})
			expect(new_proposal.proposal_votable).toBe(false)
			expect(new_proposal.proposal_passed).toBe(false)
		})
		
		test('Error: Proposal DNE', async () => {
			await expect(prop_erase_i(get_uuid(), 'name', [])).rejects.toThrow(new Error(errors.proposal_dne))
		})
	})
})
