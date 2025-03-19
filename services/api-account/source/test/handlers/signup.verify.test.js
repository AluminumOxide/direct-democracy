const { errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	sign_up_verify_unit: sign_up
} = require('../helper')

describe('Sign Up Verify', () => {

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { email_token: 'test', account_token: 'test', encrypted_profile: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				call_no: 1,
				throws_error: false,
				last_val: [{ id: 'test'}]
			},{
				last_fxn: 'del',
				throws_error: false,
				last_val: [{ token: 'test' }]
			},{
				last_fxn: 'update',
				throws_error: false,
				last_val: []
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

		test('Error: Account DNE', async() => {

			// set up mocks
			const dummy_req = { email_token: 'test', account_token: 'test', encrypted_profile: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				call_no: 1,
				throws_error: false,
				last_val: []
			}])

			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.account_dne))
			expect(dummy_reply.code).toBeCalledWith(400)


			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Duplicate Account', async() => {

			// set up mocks
			const dummy_req = { email_token: 'test', account_token: 'test', encrypted_profile: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				call_no: 1,
				throws_error: false,
				last_val: [{},{}]
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
		
		test('Error: Token DNE', async() => {

			// set up mocks
			const dummy_req = { email_token: 'test', account_token: 'test', encrypted_profile: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				call_no: 1,
				throws_error: false,
				last_val: [{ id: 'test' }]
			},{
				last_fxn: 'del',
				throws_error: false,
				last_val: []
			}])

			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.token_dne))
			expect(dummy_reply.code).toBeCalledWith(400)


			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Duplicate Token', async() => {

			// set up mocks
			const dummy_req = { email_token: 'test', account_token: 'test', encrypted_profile: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				call_no: 1,
				throws_error: false,
				last_val: [{ id: 'test' }]
			},{
				last_fxn: 'del',
				throws_error: false,
				last_val: [{},{}]
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
		
		test('Error: DB Error', async() => {

			// set up mocks
			const dummy_req = { email_token: 'test', account_token: 'test', encrypted_profile: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				call_no: 1,
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
