const { errors,
	get_uuid,
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
			const { salt, key } = await sign_in_i(test_data.profile.profile.id, test_data.profile.profile.auth_public)
			expect(salt).toBe(test_data.profile.profile.auth_salt)
			expect(key).toBeDefined()
		})

		test('Error: Invalid Profile', async() => {
			await expect(sign_in_i(get_uuid(), test_data.profile.profile.auth_public)).rejects.toThrow(errors.profile_dne)
		})

		// TODO
		//test('Error: Invalid Key', async() => {
		//	await expect(sign_in_i(test_data.profile.profile.id, 'bad')).rejects.toThrow(Error)
		//})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				call: 1,
				err: false,
				val: [{ auth_salt: 'test', auth_zkpp: 'test'}]
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
			expect(dummy_reply.send).toBeCalledWith({ salt: 'test', key: 'test' })
			expect(dummy_reply.code).toBeCalledWith(200)


			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Profile DNE', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: { public: 'test', private: 'test' },
				err: false
			}])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test'}],
				call: 1,
				err: false,
				val: []
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.profile_dne))
			expect(dummy_reply.code).toBeCalledWith(400)


			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Duplicate Account', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: { public: 'test', private: 'test' },
				err: false
			}])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				call: 1,
				err: false,
				val: [{},{}]
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
		
		test('Error: DB Error', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: { public: 'test', private: 'test' },
				err: false
			}])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				call: 1,
				err: true
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
	
		test('Error: Auth Lib', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				call: 1,
				err: false,
				val: [{ auth_salt: 'test', auth_zkpp: 'test'}]
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
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toBeCalledWith(500)


			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})
})
