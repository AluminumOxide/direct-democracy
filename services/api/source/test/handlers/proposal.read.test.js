const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	proposal_read_unit: prop_read_u,
	proposal_read_integration: prop_read_i
} = require('../helper')

describe('Proposal Read Public', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const expected = test_data.proposal.root_name_failed
			const actual = await prop_read_i(expected.id)
			expect(actual.proposal_id).toBe(expected.id)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: dummy_req,
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { democracy_id: 'test', democracy_name: 'test' },
				err: false
			}], errors)
			
			// call handler
			await prop_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(200)
			expect(dummy_reply.send).toHaveBeenCalledWith(dummy_req)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Proposal DNE', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: errors.proposal_dne,
				err: true
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { democracy_id: 'test', democracy_name: 'test' },
				err: false
			}], errors)
			
			// call handler
			await prop_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.proposal_dne))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Internal error', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: errors.internal_error,
				err: true
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { democracy_id: 'test', democracy_name: 'test' },
				err: false
			}], errors)
			
			// call handler
			await prop_read_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

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
