const { errors,
	get_dummy_log,
	get_dummy_db,
	get_dummy_reply,
	get_random_token,
	integration_test_query,
	integration_test_setup,
	fill_bucket_unit: fill_u,
	fill_bucket_integration: fill_i
} = require('../helper')

describe('Fill Bucket', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success: Account Bucket', async() => {
			await fill_i('account', ['test'])
			const check = await integration_test_query('account', `select token from token where bucket='account' and token = 'test'`)
			expect(check.rowCount).toBe(1)
		})

		test('Success: Email Bucket', async() => {
			await fill_i('email', ['test'])
			const check = await integration_test_query('account', `select token from token where bucket='email' and token = 'test'`)
			expect(check.rowCount).toBe(1)
		})
	
		test('Success: Long Token List', async() => {
			const count1 = await integration_test_query('account', 'select token from token')
			const n = 1000
			await fill_i('account', Array.apply('asdf', Array(n).fill(0).map(m => get_random_token())))
			const count2 = await integration_test_query('account', 'select token from token')
			expect(count1.rowCount+n).toBe(count2.rowCount)
		})
		
		test('Error: Invalid Bucket', async() => {
			await expect(fill_i('bad', ['test'])).rejects.toThrow(Error)
		})
		
		test('Error: Empty Token List', async() => {
			await expect(fill_i('account', [])).rejects.toThrow(Error)
		})

		test('Error: Invalid Token List', async() => {
			await expect(fill_i('account', 'bad')).rejects.toThrow(Error)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { bucket: 'account', tokens: ['test'] }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'insert',
				err: false,
				val: true
			}])

			// call handler
			await fill_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith()
			expect(dummy_reply.code).toHaveBeenCalledWith(200)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Invalid Bucket', async() => {

			// set up mocks
			const dummy_req = { bucket: 'test', tokens: ['test'] }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])

			// call handler
			await fill_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.bucket_dne))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid Tokens', async() => {

			// set up mocks
			const dummy_req = { bucket: 'account', tokens: [] }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])

			// call handler
			await fill_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.token_empty))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: DB Error', async() => {

			// set up mocks
			const dummy_req = { bucket: 'account', tokens: ['test'] }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'insert',
				err: true
			}])

			// call handler
			await fill_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
	})
})
