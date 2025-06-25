const { errors,
	get_uuid,
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
			const { proof, jwt } = await sign_in_i(test_data.profile.profile.id, test_data.profile.profile.proof)
			expect(proof).toBeDefined()
			expect(jwt).toBeDefined()
		})

		test('Error: Invalid Profile', async() => {
			await expect(sign_in_i(get_uuid(), test_data.profile.profile.proof)).rejects.toThrow(errors.profile_dne)
		})
		
		test('Error: Invalid Key', async() => {
			await expect(sign_in_i(test_data.profile.profile.id, 'bad')).rejects.toThrow(Error)
		})
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
				val: [{ auth_salt: 'test', auth_zkpp: 'test', auth_public: 'test', auth_private: 'test' }]
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
			},{
				lib: 'lib_auth',
				fxn: 'token_random',
				val: 'test',
				err: false
			}])

			// call handler
			await sign_in_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			let auth_expiry = new Date()
                	auth_expiry.setHours(auth_expiry.getHours() + 1)
			expect(dummy_reply.send).toBeCalledWith({
				proof: 'test',
				jwt: {
					profile_id: 'test',
					auth_token: 'test',
					auth_expiry }})
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
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				call: 1,
				err: false,
				val: []
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'token_random',
				val: 'test',
				err: false
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
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				call: 1,
				err: false,
				val: [{},{}]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'token_random',
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
		
		test('Error: DB Error', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				call: 1,
				err: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'token_random',
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
			const dummy_req = { profile_id: 'test', key: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				call: 1,
				err: false,
				val: [{ auth_salt: 'test', auth_zkpp: 'test', auth_public: 'test', auth_private: 'test' }]
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
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toBeCalledWith(500)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})
})
