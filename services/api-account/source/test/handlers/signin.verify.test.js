const { errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_lib,
	sign_in_verify_unit: sign_in
} = require('../helper')

describe('Sign In Verify', () => {

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { email: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ email: 'test' }],
				call_no: 1,
				throws_error: false,
				last_val: [{ auth_salt: 'test', auth_zkpp: 'test', auth_public: 'test', auth_private: 'test', encrypted_question: 'test', encrypted_profile: 'test'}]
			},{
				last_fxn: 'update',
				throws_error: false,
				last_val: true
			}])
			get_dummy_lib('auth', [{
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			}])

			// call handler
			await sign_in(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith({ server_proof: 'test', encrypted_question: 'test', encrypted_profile: 'test' })
			expect(dummy_reply.code).toBeCalledWith(200)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Account DNE', async() => {

			// set up mocks
			const dummy_req = { email: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ email: 'test' }],
				call_no: 1,
				throws_error: false,
				last_val: []
			}])

			// call handler
			await sign_in(dummy_req, dummy_reply, dummy_db, dummy_log)

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
			const dummy_req = { email: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ email: 'test' }],
				call_no: 1,
				throws_error: false,
				last_val: [{},{}]
			}])

			// call handler
			await sign_in(dummy_req, dummy_reply, dummy_db, dummy_log)

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
			const dummy_req = { email: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ email: 'test' }],
				call_no: 1,
				throws_error: true
			}])

			// call handler
			await sign_in(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toBeCalledWith(500)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		// TODO: test auth lib error
	})
})
