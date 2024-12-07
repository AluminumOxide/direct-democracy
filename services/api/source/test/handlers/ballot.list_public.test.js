const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_api,
	integration_test_setup,
	ballot_list_public_unit: blt_list_u
} = require('../helper')

describe('Ballot List Public', () => {

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { filter:{}, democracy_id: get_uuid() }
			const dummy_val = []
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: { democracy_id: dummy_req.democracy_id },
				err: false
			},{
				fxn: 'ballot_list',
				val: dummy_val,
				err: false
			}])
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log)

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
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log)

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
			const dummy_reply = get_dummy_reply()
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log)

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
			const dummy_req = { filter:{}, democracy_id: get_uuid() }
			const dummy_val = []
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: { democracy_id: get_uuid() },
				err: false
			}])
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log)

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
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: new Error(errors.proposal_dne),
				err: true
			}])
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log)

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
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: new Error(errors.internal_error),
				err: true
			}])
			
			// call handler
			await blt_list_u(dummy_req, dummy_reply, {}, dummy_log)

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
