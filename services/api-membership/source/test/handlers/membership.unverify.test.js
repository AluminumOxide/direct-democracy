const {
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	integration_test_setup,
	membership_unverify_unit: mem_unverify_u,
	membership_unverify_integration: mem_unverify_i
} = require('../helper')

describe('Membership Unverify', () => {

	describe('Unit Tests', () => {	

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964'
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			}])

			// call handler
			await mem_unverify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith(dummy_req)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: no membership
		test('Error: Membership dne', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964'
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [],
				err: false
			}])

			// call handler
			await mem_unverify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.membership_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: db
		test('Error: Database error', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964'
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: false,
				err: new Error('db error')
			}])

			// call handler
			await mem_unverify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		// success: unverified
		test('Success: Unverified', async () => {
			const test_mem = test_data['membership']['unverified_root_1']
			const mem = await mem_unverify_i(test_mem.id)
			expect(mem.membership_id).toBe(test_mem.id)
			expect(mem.democracy_id ).toBe(test_mem.democracy_id)
			expect(mem.profile_id).toBe(test_mem.profile_id)
			expect(mem.is_verified).toBeFalsy()
			expect(mem.date_created).toBeDefined()
			expect(mem.date_updated).toBeDefined()
		})

		// success: verified
		test('Success: Verified', async () => {
			const test_mem = test_data['membership']['verified_root_1']
			const mem = await mem_unverify_i(test_mem.id)
			expect(mem.membership_id).toBe(test_mem.id)
			expect(mem.democracy_id ).toBe(test_mem.democracy_id)
			expect(mem.profile_id).toBe(test_mem.profile_id)
			expect(mem.is_verified).toBeFalsy()
			expect(mem.date_created).toBeDefined()
			expect(mem.date_updated).toBeDefined()
		})

		// error: no id
		test('Error: No membership id', async () => {
			await expect(mem_unverify_i({}))
				.rejects.toThrow(new Error(errors._invalid_param))
		})

		// error: non-uuid id
		test('Error: Non-uuid membership id', async () => {
			await expect(mem_unverify_i('bad-val'))
				.rejects.toThrow(new Error(errors._invalid_param))
		})

		// error: invalid id
		test('Error: Invalid membership id', async () => {
			await expect(mem_unverify_i('00000000-0000-0000-0000-000000000000'))
				.rejects.toThrow(new Error(errors.membership_dne))
		})
	})
})
