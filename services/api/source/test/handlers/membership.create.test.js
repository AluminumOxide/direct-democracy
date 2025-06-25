const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	membership_create_unit: mem_create_u,
	membership_create_integration: mem_create_i
} = require('../helper')

describe('Membership Create', () => {
	
	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const mem = await mem_create_i(test_data['democracy']['root'].id, get_uuid())
			expect(mem.democracy_id).toBe(test_data['democracy']['root'].id)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_create',
				val: dummy_req,
				err: false
			}], errors)
			
			// call handler
			await mem_create_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith(dummy_req)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Democracy DNE', async() => {

			// set up mocks
			const dummy_req = { democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_create',
				val: errors.democracy_dne,
				err: true
			}], errors)
			
			// call handler
			await mem_create_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.democracy_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Membership exists', async() => {

			// set up mocks
			const dummy_req = { democracy_id: get_uuid() }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_create',
				val: errors.membership_exist,
				err: true
			}], errors)
			
			// call handler
			await mem_create_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.membership_exist))

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
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_create',
				val: errors.internal_error,
				err: true
			}], errors)
			
			// call handler
			await mem_create_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

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
