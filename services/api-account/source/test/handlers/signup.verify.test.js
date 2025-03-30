const { errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_lib,
	integration_test_setup,
	integration_test_query,
	fill_bucket_integration: fill_bucket,
	sign_up_verify_unit: sign_up_u,
	sign_up_verify_integration: sign_up_i
} = require('../helper')

describe('Sign Up Verify', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {

			// set up account token
			const account_token = 'accounttokentest'
			await fill_bucket('account', [account_token])

			// set up email token
			const email_token = 'emailtokentest'
			const account_email = test_data.account.unverified.email
			await integration_test_query('account',`update account set email_token='${email_token}' where email='${account_email}';`)
			
			// verify status updates
			await sign_up_i(email_token, account_token, 'test')
			const rows = await integration_test_query('account', `select is_verified from account where email='${account_email}';`)
			expect(rows.rows[0].is_verified).toBeTruthy()
		})
		
		test('Error: Invalid Email Token', async() => {
			await expect(sign_up_i('bad', 'test', 'test')).rejects.toThrow(errors.account_dne)
		})
		
		test('Error: Invalid Account Token', async() => {
			const email_token = 'emailtokentest'
			const account_email = test_data.account.unverified.email
			await integration_test_query('account',`update account set email_token='${email_token}' where email='${account_email}';`)
			await expect(sign_up_i(email_token, 'bad', 'test')).rejects.toThrow(errors.token_dne)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { email_token: 'test', account_token: 'test', encrypted_profile: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				call: 1,
				err: false,
				val: [{ id: 'test'}]
			},{
				fxn: 'del',
				err: false,
				val: [{ token: 'test' }]
			},{
				fxn: 'update',
				err: false,
				val: []
			}])

			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				call: 1,
				err: false,
				val: []
			}])

			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				call: 1,
				err: false,
				val: [{},{}]
			}])

			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				call: 1,
				err: false,
				val: [{ id: 'test' }]
			},{
				fxn: 'del',
				err: false,
				val: []
			}])

			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				call: 1,
				err: false,
				val: [{ id: 'test' }]
			},{
				fxn: 'del',
				err: false,
				val: [{},{}]
			}])

			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				call: 1,
				err: true
			}])

			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
