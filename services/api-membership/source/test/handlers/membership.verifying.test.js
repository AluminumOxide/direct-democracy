const {
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	integration_test_setup,
	membership_verifying_unit: mem_verify_u,
	membership_verifying_integration: mem_verify_i
} = require('../helper')

describe('Membership Verifying', () => {

	describe('Unit Tests', () => {	

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964'
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {is_verified: false, is_verifying: false},
				err: false
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			}])

			// call handler
			await mem_verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(200)
			expect(dummy_reply.send).toHaveBeenCalledWith(dummy_req)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Membership already verified', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964'
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {is_verified: true, is_verifying: false},
				err: false
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			}])

			// call handler
			await mem_verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_verified))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Membership already verifying', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964'
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {is_verified: false, is_verifying: true},
				err: false
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			}])

			// call handler
			await mem_verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_verified))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: no membership
		test('Error: Membership dne', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964'
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: errors.membership_dne,
				err: true
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [],
				err: false
			}])

			// call handler
			await mem_verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_dne))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Membership update failure', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964'
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {is_verified: false, is_verifying: false},
				err: false
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [],
				err: false
			}])

			// call handler
			await mem_verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		// error: db
		test('Error: Database error', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964'
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {is_verified: false, is_verifying: false},
				err: false
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: false,
				err: new Error('db error')
			}])

			// call handler
			await mem_verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
		const prop_id = '00000000-0000-0000-0000-000000000000'

		// success: unverified
		test('Success: Unverified', async () => {
			const test_mem = test_data['membership']['unverified_root_1']
			const mem = await mem_verify_i(test_mem.id, prop_id)
			expect(mem.membership_id).toBe(test_mem.id)
			expect(mem.democracy_id ).toBe(test_mem.democracy_id)
			expect(mem.profile_id).toBe(test_mem.profile_id)
			expect(!mem.is_verified).toBeTruthy()
			expect(mem.is_verifying).toBeTruthy()
			expect(mem.date_created).toBeDefined()
			expect(mem.date_updated).toBeDefined()
		})

		// success: verified
		test('Error: Already verified', async () => {
			await expect(mem_verify_i(test_data.membership.verified_root_1.id, prop_id))
				.rejects.toThrow(new Error(errors.membership_verified))
		})

		// error: no id
		test('Error: No membership id', async () => {
			await expect(mem_verify_i({}))
				.rejects.toThrow(new Error(errors._invalid_param))
		})

		// error: non-uuid id
		test('Error: Non-uuid membership id', async () => {
			await expect(mem_verify_i('bad-val'))
				.rejects.toThrow(new Error(errors._invalid_param))
		})

		// error: invalid id
		test('Error: Invalid membership id', async () => {
			await expect(mem_verify_i('00000000-0000-0000-0000-000000000000',prop_id))
				.rejects.toThrow(new Error(errors.membership_dne))
		})
	})
})
