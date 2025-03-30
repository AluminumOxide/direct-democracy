const { errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	integration_test_setup,
	step_three_integration: three_i,
	step_three_unit: three_u } = require('../helper')

describe('Step Three', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()
		
		test('Success', async() => {
			const { encrypted_token, pake_proof } = await three_i(test_data.auth.email.pake_public, test_data.auth.email.pake_proof)
			expect(encrypted_token).toBeDefined()
			expect(pake_proof).toBeDefined()
		})	
		test('Error: No PAKE key', async() => {
			await expect(three_i(null, test_data.auth.email.pake_proof)).rejects.toThrow(Error)
		})
		test('Error: Numeric PAKE key', async() => {
			await expect(three_i(123, test_data.auth.email.pake_proof)).rejects.toThrow(Error)
		})
		test('Error: Invalid PAKE key', async() => {
			await expect(three_i('asdf', test_data.auth.email.pake_proof)).rejects.toThrow(Error)
		})
		test('Error: No PAKE proof', async() => {
			await expect(three_i('todo', null)).rejects.toThrow(Error)
		})
		test('Error: Numeric PAKE proof', async() => {
			await expect(three_i('todo', 123)).rejects.toThrow(Error)
		})
		test('Error: Invalid PAKE proof', async() => {
			await expect(three_i('todo', 'asdf')).rejects.toThrow(Error)
		})
	})

	describe('Unit Tests', () => {

		test('Success: Email Token', async() => {

			// set up mocks
			const dummy_req = { pake_key: 'test', pake_proof: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'del',
				val: [{ token: 'test' }],
				err: false
			},{
				fxn: 'where',
				args: [{ pake_public: 'test' }],
				val: [{
					token_id: 'test',
					pke_secret: 'test',
					pake_private: 'test'
				}],
				err: false
			},{
				fxn: 'where',
				args: [{ token: 'test' }],
				val: [{
					bucket: 'email',
					zkpp: 'test',
					salt: 'test'
				}],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'jwt_sign',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'encrypt',
				val: 'test',
				err: false
			}])

			// call handler
			await three_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith({
				pake_proof: 'test',
				encrypted_token: 'test'
			})

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Success: Signup Token', async() => {

			// set up mocks
			const dummy_req = { pake_key: 'test', pake_proof: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'del',
				val: [{ token: 'test' }],
				err: false
			},{
				fxn: 'where',
				args: [{ pake_public: 'test' }],
				val: [{
					token_id: 'test',
					pke_secret: 'test',
					pake_private: 'test'
				}],
				err: false
			},{
				fxn: 'where',
				args: [{ token: 'test' }],
				val: [{
					bucket: 'signup',
					zkpp: 'test',
					salt: 'test'
				}],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'jwt_sign',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'encrypt',
				val: 'test',
				err: false
			}])

			// call handler
			await three_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith({
				pake_proof: 'test',
				encrypted_token: 'test'
			})

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Invalid pake key', async() => {

			// set up mocks
			const dummy_req = { pake_key: 'test', pake_proof: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ pake_public: 'test' }],
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'jwt_sign',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'encrypt',
				val: 'test',
				err: false
			}])

			// call handler
			await three_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_input))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Invalid token', async() => {

			// set up mocks
			const dummy_req = { pake_key: 'test', pake_proof: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ pake_public: 'test' }],
				val: [{
					token_id: 'test',
					pke_secret: 'test',
					pake_private: 'test'
				}],
				err: false
			},{
				fxn: 'where',
				args: [{ token: 'test' }],
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'jwt_sign',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'encrypt',
				val: 'test',
				err: false
			}])

			// call handler
			await three_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_input))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Invalid pake proof', async() => {

			// set up mocks
			const dummy_req = { pake_key: 'test', pake_proof: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'del',
				val: [{ token: 'test' }],
				err: false
			},{
				fxn: 'where',
				args: [{ pake_public: 'test' }],
				val: [{
					token_id: 'test',
					pke_secret: 'test',
					pake_private: 'test'
				}],
				err: false
			},{
				fxn: 'where',
				args: [{ token: 'test' }],
				val: [{
					bucket: 'email',
					zkpp: 'test',
					salt: 'test'
				}],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: new Error(),
				err: true
			},{
				lib: 'lib_auth',
				fxn: 'jwt_sign',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'encrypt',
				val: 'test',
				err: false
			}])

			// call handler
			await three_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.invalid_input))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: DB Failure', async() => {

			// set up mocks
			const dummy_req = { pake_key: 'test', pake_proof: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'del',
				val: errors.internal_error,
				err: true
			},{
				fxn: 'where',
				args: [{ pake_public: 'test' }],
				val: errors.internal_error,
				err: true
			},{
				fxn: 'where',
				args: [{ token: 'test' }],
				val: errors.internal_error,
				err: true
			}])
			const dummy_lib = { lib_auth: {}}

			// call handler
			await three_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		test('Error: Auth Failure', async() => {
			
			// set up mocks
			const dummy_req = { pake_key: 'test', pake_proof: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'del',
				val: [{ token: 'test' }],
				err: false
			},{
				fxn: 'where',
				args: [{ pake_public: 'test' }],
				val: [{
					token_id: 'test',
					pke_secret: 'test',
					pake_private: 'test'
				}],
				err: false
			},{
				fxn: 'where',
				args: [{ token: 'test' }],
				val: [{
					bucket: 'email',
					zkpp: 'test',
					salt: 'test'
				}],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pake_server_derive_proof',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'encrypt',
				val: errors.internal_error,
				err: true
			}])

			// call handler
			await three_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

	})
})
