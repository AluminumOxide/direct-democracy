const { errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_lib,
	integration_test_setup,
	sign_in_verify_unit: sign_in_u,
	sign_in_verify_integration: sign_in_i
} = require('../helper')

describe('Sign In Verify', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const { server_proof, encrypted_question, encrypted_profile } = await sign_in_i(test_data.account.verified.email, test_data.account.verified.client_proof)
			expect(server_proof).toBe(test_data.account.verified.server_proof)
			expect(encrypted_question).toBe(test_data.account.verified.encrypted_question)
			expect(encrypted_profile).toBe(test_data.account.verified.encrypted_profile)
		})

		test('Error: Invalid Email', async() => {
			await expect(sign_in_i('bad@bady.bad', test_data.account.verified.client_proof)).rejects.toThrow(errors.account_dne)
		})

		test('Error: Invalid Key', async() => {
			await expect(sign_in_i(test_data.account.verified.email, 'badbadbadbadbadbad')).rejects.toThrow(errors.invalid_key)
		})

		test('Error: Unverified Account', async() => {
			await expect(sign_in_i(test_data.account.unverified.email, test_data.account.unverified.client_proof)).rejects.toThrow(errors.account_unverified)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { email: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ email: 'test' }],
				call: 1,
				err: false,
				val: [{ auth_salt: 'test', auth_zkpp: 'test', auth_public: 'test', auth_private: 'test', encrypted_question: 'test', encrypted_profile: 'test', is_verified: true}]
			},{
				fxn: 'update',
				err: false,
				val: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
				fxn: 'where',
				args: [{ email: 'test' }],
				call: 1,
				err: false,
				val: []
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
				fxn: 'where',
				args: [{ email: 'test' }],
				call: 1,
				err: false,
				val: [{},{}]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toBeCalledWith(500)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Account Unverified', async() => {

			// set up mocks
			const dummy_req = { email: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ email: 'test' }],
				call: 1,
				err: false,
				val: [{ auth_salt: 'test', auth_zkpp: 'test', auth_public: 'test', auth_private: 'test', encrypted_question: 'test', encrypted_profile: 'test', is_verified: false }]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.account_unverified))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Invalid Key', async() => {

			// set up mocks
			const dummy_req = { email: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ email: 'test' }],
				call: 1,
				err: false,
				val: [{ auth_salt: 'test', auth_zkpp: 'test', auth_public: 'test', auth_private: 'test', encrypted_question: 'test', encrypted_profile: 'test', is_verified: true}]
			},{
				fxn: 'update',
				err: false,
				val: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: true
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_key))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: DB Error', async() => {

			// set up mocks
			const dummy_req = { email: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ email: 'test' }],
				call: 1,
				err: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toBeCalledWith(500)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Auth Error', async() => {

			// set up mocks
			const dummy_req = { email: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ email: 'test' }],
				call: 1,
				err: false,
				val: [{ auth_salt: 'test', auth_zkpp: 'test', auth_public: 'test', auth_private: 'test', encrypted_question: 'test', encrypted_profile: 'test', is_verified: true}]
			},{
				fxn: 'update',
				err: false,
				val: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: new Error(),
				err: true
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_key))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
	})
})
