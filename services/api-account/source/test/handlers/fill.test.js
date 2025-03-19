const { errors,
	get_dummy_log,
	get_dummy_db,
	get_dummy_reply,
	fill_bucket_unit: fill
} = require('../helper')

describe('Fill Bucket', () => {

	describe('Unit Tests', () => {

		test('Success: Account Bucket', async() => {

			// set up mocks
			const dummy_req = { bucket: 'account', tokens: ['test'] }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'insert',
				throws_error: false,
				last_val: true
			}])

			// call handler
			await fill(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith()
			expect(dummy_reply.code).toBeCalledWith(200)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Success: Email Bucket', async() => {

			// set up mocks
			const dummy_req = { bucket: 'email', tokens: ['test'] }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'insert',
				throws_error: false,
				last_val: true
			}])

			// call handler
			await fill(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith()
			expect(dummy_reply.code).toBeCalledWith(200)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Bucket DNE', async() => {

			// set up mocks
			const dummy_req = { bucket: 'test', tokens: ['test'] }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])

			// call handler
			await fill(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.bucket_dne))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: DB Error', async() => {

			// set up mocks
			const dummy_req = { bucket: 'account', tokens: ['test'] }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'insert',
				throws_error: true
			}])

			// call handler
			await fill(dummy_req, dummy_reply, dummy_db, dummy_log)

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
