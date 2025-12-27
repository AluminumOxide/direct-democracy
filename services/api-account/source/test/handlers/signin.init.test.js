const { errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_lib,
	integration_test_setup,
	sign_in_init_unit: sign_in_u,
	sign_in_init_integration: sign_in_i
} = require('../helper')

describe('Sign In Init', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const { salt, key } = await sign_in_i(test_data.account.verified.email, test_data.account.verified.auth_public)
			expect(salt).toBe(test_data.account.verified.auth_salt)
			expect(key).toBeDefined()
		})

		test('Error: Invalid Email', async() => {
			await expect(sign_in_i('bad@bady.bad', test_data.account.verified.auth_public)).rejects.toThrow(errors.account_dne)
		})
	
	// TODO
	//	test('Error: Invalid Key', async() => {
	//		await expect(sign_in_i(test_data.account.verified.email, 'badbadbadbadbad')).rejects.toThrow(Error)
	//	})

		test('Error: Unverified Account', async() => {
			await expect(sign_in_i(test_data.account.unverified.email, test_data.account.unverified.auth_public)).rejects.toThrow(errors.account_unverified)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { email: 'testy@mctestface', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ email: dummy_req.email}],
				call: 1,
				err: false,
				val: [{ auth_salt: 'test', auth_zkpp: 'test', is_verified: true}]
			},{
				fxn: 'update',
				err: false,
				val: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: { public: 'test', private: 'test' },
				err: false
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith({ salt: 'test', key: 'test' })
			expect(dummy_reply.code).toHaveBeenCalledWith(200)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Account DNE', async() => {

			// set up mocks
			const dummy_req = { email: 'testy@mctestface', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ email: dummy_req.email}],
				call: 1,
				err: false,
				val: []
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: { public: 'test', private: 'test' },
				err: false
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.account_dne))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Duplicate Account', async() => {

			// set up mocks
			const dummy_req = { email: 'testy@mctestface', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ email: dummy_req.email}],
				call: 1,
				err: false,
				val: [{},{}]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: { public: 'test', private: 'test' },
				err: false
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
		
		test('Error: Account Unverified', async() => {

			// set up mocks
			const dummy_req = { email: 'testy@mctestface', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ email: dummy_req.email}],
				call: 1,
				err: false,
				val: [{ auth_salt: 'test', auth_zkpp: 'test', is_verified: false }]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: { public: 'test', private: 'test' },
				err: false
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.account_unverified))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: DB Error', async() => {

			// set up mocks
			const dummy_req = { email: 'testy@mctestface', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ email: dummy_req.email}],
				call: 1,
				err: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: { public: 'test', private: 'test' },
				err: false
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
	
		test('Error: Auth Error', async() => {

			// set up mocks
			const dummy_req = { email: 'testy@mctestface', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ email: dummy_req.email}],
				call: 1,
				err: false,
				val: [{ auth_salt: 'test', auth_zkpp: 'test', is_verified: true}]
			},{
				fxn: 'update',
				err: false,
				val: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: new Error(),
				err: true
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
