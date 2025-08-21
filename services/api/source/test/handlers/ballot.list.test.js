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

describe('Ballot List Public', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const blts = await blt_list_i({
				democracy_id: test_data.democracy.root.id,
				proposal_id: test_data.proposal.root_conduct_fail.id
			})
			expect(blts.length).toBe(3)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { filter:{}, democracy_id: get_uuid() }
			const dummy_val = []
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { democracy_id: dummy_req.democracy_id },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_list',
				val: dummy_val,
				err: false
			}], errors)
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith(dummy_val)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Profile ID provided', async() => {

			// set up mocks
			const dummy_req = { filter:{profile_id:{}}, democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_auth))
			expect(dummy_reply.code).toBeCalledWith(401)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Membership ID provided', async() => {

			// set up mocks
			const dummy_req = { filter:{membership_id:{}}, democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_reply = get_dummy_reply()
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_auth))
			expect(dummy_reply.code).toBeCalledWith(401)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Invalid democracy', async() => {

			// set up mocks
			const dummy_req = { democracy_id: get_uuid() }
			const dummy_val = []
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { democracy_id: get_uuid() },
				err: false
			}], errors)
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.democracy_invalid))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Invalid Proposal', async() => {

			// set up mocks
			const dummy_req = { filter:{}, democracy_id: get_uuid() }
			const dummy_val = []
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: errors.proposal_dne,
				err: true
			}], errors)
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.proposal_dne))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Internal Error', async() => {

			// set up mocks
			const dummy_req = { filter:{}, democracy_id: get_uuid() }
			const dummy_val = []
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: errors.internal_error,
				err: true
			}], errors)
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toBeCalledWith(500)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})
})
