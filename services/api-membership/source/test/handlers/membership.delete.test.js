const {
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	membership_delete_unit: mem_del_u,
	membership_read_integration: mem_read_i,
	membership_delete_integration: mem_del_i
} = require('../helper')

describe('Membership Delete', () => {

	describe('Unit Tests', () => {

		// success
		test('Success', async() => {
			
			// set up mocks
			const dummy_req = {
				membership_id: '4332fd2d-31bf-4fce-a759-2abb8dbe6fbb',
				profile_id: 'feb19ac5-bdf0-4e50-aaa6-9401bed02273'
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: dummy_req.membership_id }],
				val: [dummy_req],
				err: false,
				call: 1
			},{
				fxn: 'del',
				args: false,
				val: [],
				err: false,
				call: false
			}])

			// call handler
			await mem_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith()
			expect(dummy_reply.code).toHaveBeenCalledWith(204)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: membership dne
		test('Error: Membership does not exist', async() => {
			
			// set up mocks
			const dummy_req = {
				membership_id: '4332fd2d-31bf-4fce-a759-2abb8dbe6fbb',
				profile_id: 'feb19ac5-bdf0-4e50-aaa6-9401bed02273'
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: dummy_req.membership_id }],
				val: [],
				err: false
			}])

			// call handler
			await mem_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_dne))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: membership lookup failure
		test('Error: Membership lookup failure', async() => {
			
			// set up mocks
			const dummy_req = {
				membership_id: '4332fd2d-31bf-4fce-a759-2abb8dbe6fbb',
				profile_id: 'feb19ac5-bdf0-4e50-aaa6-9401bed02273'
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: dummy_req.membership_id }],
				val: [],
				err: true
			}])

			// call handler
			await mem_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		// error: profile id invalid
		test('Error: Profile id is invalid', async() => {
			
			// set up mocks
			const dummy_req = {
				membership_id: '4332fd2d-31bf-4fce-a759-2abb8dbe6fbb',
				profile_id: 'feb19ac5-bdf0-4e50-aaa6-9401bed02273'
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: dummy_req.membership_id }],
				val: [{
					membership_id: dummy_req.membership_id,
					profile_id: dummy_req.membership_id
				}],
				err: false
			}])

			// call handler
			await mem_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.profile_invalid))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: deletion error
		test('Error: Deletion error', async() => {
			
			// set up mocks
			const dummy_req = {
				membership_id: '4332fd2d-31bf-4fce-a759-2abb8dbe6fbb',
				profile_id: 'feb19ac5-bdf0-4e50-aaa6-9401bed02273'
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: dummy_req.membership_id }],
				val: [dummy_req],
				err: false,
				call: 1
			},{
				fxn: 'del',
				args: false,
				val: [],
				err: true,
				call: false
			}])

			// call handler
			await mem_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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

		// success: verified
		test('Success: Verified', async () => {
			const mem_id = test_data['membership']['verified_root_1']['id']
			const pro_id = test_data['membership']['verified_root_1']['profile_id']
			await expect(mem_read_i(mem_id)).resolves.toBeInstanceOf(Object)
			await mem_del_i(mem_id, pro_id)
			await expect(mem_read_i(mem_id)).rejects.toThrow(new Error(errors.membership_dne))
		})

		// success: unverified
		test('Success: Unverified', async () => {
			const mem_id = test_data['membership']['unverified_root_1']['id']
			const pro_id = test_data['membership']['unverified_root_1']['profile_id']
			await expect(mem_read_i(mem_id)).resolves.toBeInstanceOf(Object)
			await mem_del_i(mem_id, pro_id)
			await expect(mem_read_i(mem_id)).rejects.toThrow(new Error(errors.membership_dne))
		})

		// error: membership id invalid
		test('Error: Invalid membership id', async () => {
			await expect(mem_del_i('68cd7ef4-5fd2-4745-9a7a-e67a6d62ecfc','a60f9594-a763-435e-b8a0-b31e7f21a881'))
				.rejects.toThrow(new Error(errors.membership_dne))
		})

		// error: profile id invalid
		test('Error: Invalid profile id', async () => {
			await expect(mem_del_i('58cd7ef4-5fd2-4745-9a7a-e67a6d62ecfc','b60f9594-a763-435e-b8a0-b31e7f21a881'))
				.rejects.toThrow(new Error(errors.profile_invalid))
		})
	})	
})
