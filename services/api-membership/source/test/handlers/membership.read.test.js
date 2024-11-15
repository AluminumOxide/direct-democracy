const {
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	reset_test_data,
	membership_read_unit: mem_read_u,
	membership_read_integration: mem_read_i
} = require('../helper')

describe('Membership Read', () => {

	describe('Unit Tests', () => {	

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = {membership_id: '9cc71698-5845-4186-8620-2efb1cecc964'}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where', 
				last_args: ['membership.id', dummy_req.membership_id],
				last_val: [dummy_req],
				throws_error: false
			}])

			// call handler
			await mem_read_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
			const dummy_req = {membership_id: '9cc71698-5845-4186-8620-2efb1cecc964'}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where', 
				last_args: ['membership.id', dummy_req.membership_id],
				last_val: [],
				throws_error: false
			}])

			// call handler
			await mem_read_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
			const dummy_req = {membership_id: '9cc71698-5845-4186-8620-2efb1cecc964'}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where', 
				last_args: ['membership.id', dummy_req.membership_id],
				last_val: false,
				throws_error: new Error('db error')
			}])

			// call handler
			await mem_read_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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

		// success: unverified
		test('Success: Unverified', async () => {
			const test_data = await reset_test_data()
			const test_mem = test_data['membership']['unverified_root_1']
			const mem = await mem_read_i(test_mem.id)
			expect(mem.membership_id).toBe(test_mem.id)
			expect(mem.democracy_id ).toBe(test_mem.democracy_id)
			expect(mem.profile_id).toBe(test_mem.profile_id)
			expect(mem.is_verified).toBeFalsy()
			expect(mem.date_created).toBeDefined()
			expect(mem.date_updated).toBeDefined()
		})

		// success: verified
		test('Success: Verified', async () => {
			const test_data = await reset_test_data()
			const test_mem = test_data['membership']['verified_root_1']
			const mem = await mem_read_i(test_mem.id)
			expect(mem.membership_id).toBe(test_mem.id)
			expect(mem.democracy_id ).toBe(test_mem.democracy_id)
			expect(mem.profile_id).toBe(test_mem.profile_id)
			expect(mem.is_verified).toBeTruthy()
			expect(mem.date_created).toBeDefined()
			expect(mem.date_updated).toBeDefined()
		})

		// TODO error: no id
		// TODO error: non-uuid id

		// error: invalid id
		test('Error: Invalid membership id', async () => {
			const test_data = await reset_test_data()
			await expect(mem_read_i('acd16c5f-7abe-4ce9-ac3b-a74804af1f56')).rejects
				.toThrow(new Error(errors.membership_dne))
		})
	})
})
