const { errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_lib,
	integration_test_setup,
	fill_bucket_integration: fill_bucket,
	sign_up_init_unit: sign_up_u,
	sign_up_init_integration: sign_up_i
} = require('../helper')

describe('Sign Up Init', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			await fill_bucket('email', ['asdfasdfasdfasdfasdfsadfasdfasdfasfd'])
			await sign_up_i('test@testymctest.face', test_data.account.verified.auth_zkpp, test_data.account.verified.auth_salt, test_data.account.verified.encrypted_question)
			expect(true) // TODO: verify token sent to email
		})

		test('Error: Duplicate Email', async() => {
			await fill_bucket('email', ['asdfasdfasdfasdfasdfsadfasdfasdfasfd'])
			await expect(sign_up_i(test_data.account.verified.email, test_data.account.verified.auth_zkpp, test_data.account.verified.auth_salt, test_data.account.verified.encrypted_question)).rejects.toThrow(errors.email_exist)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { email: 'test', zkpp: 'test', salt: 'test', encrypted_question: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'del',
				err: false,
				val: [{ token: 'test'}]
			},{
				fxn: 'returning',
				err: false,
				val: [{}]
			}])
			const dummy_lib = get_dummy_lib([])

			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith()
			expect(dummy_reply.code).toHaveBeenCalledWith(200)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Token Selection Error', async() => {

			// set up mocks
			const dummy_req = { email: 'test', zkpp: 'test', salt: 'test', encrypted_question: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'del',
				err: false,
				val: []
			}])
			const dummy_lib = get_dummy_lib([])

			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
		
		test('Error: Insertion Error', async() => {

			// set up mocks
			const dummy_req = { email: 'test', zkpp: 'test', salt: 'test', encrypted_question: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'del',
				err: false,
				val: [{ token: 'test'}]
			},{
				fxn: 'returning',
				err: false,
				val: []
			}])

			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
		
		test('Error: Duplicate Key', async() => {

			// set up mocks
			const dummy_req = { email: 'test', zkpp: 'test', salt: 'test', encrypted_question: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				err: false,
				val: [{ email: 'test' }]
			}])

			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.email_exist))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: DB Error', async() => {

			// set up mocks
			const dummy_req = { email: 'test', zkpp: 'test', salt: 'test', encrypted_question: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'del',
				err: true
			}])

			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
