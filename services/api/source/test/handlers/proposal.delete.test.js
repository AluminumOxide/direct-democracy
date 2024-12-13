const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_api,
	integration_test_setup,
	proposal_delete_unit: prop_delete_u,
	proposal_delete_integration: prop_delete_i,
	proposal_read_public_integration: prop_read_i
} = require('../helper')

describe('Proposal Delete', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const prop = test_data.proposal.gchild_content_close
			await expect(prop_read_i(prop.id, prop.democracy_id)).resolves.toBeInstanceOf(Object)
			await prop_delete_i(prop.id, prop.membership_id)
			await expect(prop_read_i(prop.id, prop.democracy_id)).rejects.toThrow(new Error(errors.proposal_dne))
		})
	})
	
	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid(), democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'proposal_delete',
				val: dummy_req,
				err: false
			},{
				fxn: 'proposal_read',
				val: dummy_req,
				err: false
			}])
			
			// call handler
			await prop_delete_u(dummy_req, dummy_reply, {}, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(204)
			expect(dummy_reply.send).toBeCalledWith()

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: Proposal DNE', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: new Error(errors.proposal_dne),
				err: true
			}])
			
			// call handler
			await prop_delete_u(dummy_req, dummy_reply, {}, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.proposal_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Invalid membership', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid(), democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'proposal_delete',
				val: dummy_req,
				err: false
			},{
				fxn: 'proposal_read',
				val: { membership_id: get_uuid() },
				err: false
			}])
			
			// call handler
			await prop_delete_u(dummy_req, dummy_reply, {}, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.membership_invalid))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Internal error', async() => {

			// set up mocks
			const dummy_req = { proposal_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: new Error(errors.internal_error),
				err: true
			}])
			
			// call handler
			await prop_delete_u(dummy_req, dummy_reply, {}, dummy_log)

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
