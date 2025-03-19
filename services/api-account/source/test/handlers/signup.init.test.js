const { errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	sign_up_init_unit: sign_up
} = require('../helper')

describe('Sign Up Init', () => {

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { email: 'test', zkpp: 'test', salt: 'test', encrypted_question: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'del',
				throws_error: false,
				last_val: [{ token: 'test'}]
			},{
				last_fxn: 'returning',
				throws_error: false,
				last_val: [{}]
			}])

			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith()
			expect(dummy_reply.code).toBeCalledWith(200)


			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Token Selection Error', async() => {

			// set up mocks
			const dummy_req = { email: 'test', zkpp: 'test', salt: 'test', encrypted_question: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'del',
				throws_error: false,
				last_val: []
			}])

			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toBeCalledWith(500)


			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Insertion Error', async() => {

			// set up mocks
			const dummy_req = { email: 'test', zkpp: 'test', salt: 'test', encrypted_question: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'del',
				throws_error: false,
				last_val: [{ token: 'test'}]
			},{
				last_fxn: 'returning',
				throws_error: false,
				last_val: []
			}])

			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toBeCalledWith(500)


			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Duplicate Key', async() => {

			// set up mocks
			const dummy_req = { email: 'test', zkpp: 'test', salt: 'test', encrypted_question: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'del',
				throws_error: new Error('...duplicate key value violates unique constraint...')
			}])

			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.email_exist))
			expect(dummy_reply.code).toBeCalledWith(400)


			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: DB Error', async() => {

			// set up mocks
			const dummy_req = { email: 'test', zkpp: 'test', salt: 'test', encrypted_question: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'del',
				throws_error: true
			}])

			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

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
