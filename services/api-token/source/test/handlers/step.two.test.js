const { errors,
	get_dummy_db,
	get_dummy_lib,
	get_dummy_log,
	get_dummy_reply,
	integration_test_setup,
	step_two_integration: two_i,
	step_two_unit: two_u } = require('../helper')

describe('Step Two', () => {
	
	describe('Integration Tests', () => {

		const test_data = integration_test_setup()
		const entry = test_data.auth.setup
		const pke_pub = entry.pke_public
		const pake_pub = entry.pake_public
		const enc_id = entry.encrypted_id

		test('Success', async() => {
			const { pake_key, salt } = await two_i(pke_pub, pake_pub, enc_id)
			expect(salt).toBe(test_data.token.signup.salt)
		})

		test('Error: No PKE key', async() => {
			await expect(two_i(null, pake_pub, enc_id)).rejects.toThrow(Error)
		})

		test('Error: Numeric PKE key', async() => {
			await expect(two_i(123, pake_pub, enc_id)).rejects.toThrow(Error)
		})

		test('Error: Invalid PKE key', async() => {
			await expect(two_i('asdf', pake_pub, enc_id)).rejects.toThrow(Error)
		})
		
		test('Error: No PAKE key', async() => {
			await expect(two_i(pke_pub, null, enc_id)).rejects.toThrow(Error)
		})

		test('Error: Numeric PAKE key', async() => {
			await expect(two_i(pke_pub, 123, enc_id)).rejects.toThrow(Error)
		})
		
		test('Error: No encrypted ID', async() => {
			await expect(two_i(pke_pub, pake_pub, null)).rejects.toThrow(Error)
		})
		
		test('Error: Numeric encrypted ID', async() => {
			await expect(two_i(pke_pub, pake_pub, 123)).rejects.toThrow(Error)
		})
		
		test('Error: Invalid encrypted ID', async() => {
			await expect(two_i(pke_pub, pake_pub, 'asdf')).rejects.toThrow(Error)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { 
				pke_key: 'test',
				pake_key: 'test',
				encrypted_id: 'test'
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ pke_public: 'test' }],
				val: [{ pke_secret: 'test' }],
				err: false
			},{
				fxn: 'where',
				args: [{ token: 'test' }],
				val: [{ zkpp: 'test', salt: 'test' }],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'decrypt',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: { public: 'test', private: 'test' },
				err: false
			}])

			// call handler
			await two_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(200)
			expect(dummy_reply.send).toHaveBeenCalledWith({
				pake_key: 'test',
				salt: 'test'
			})

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid pke key', async() => {

			// set up mocks
			const dummy_req = { 
				pke_key: 'test',
				pake_key: 'test',
				encrypted_id: 'test'
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ pke_public: 'test' }],
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'decrypt',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: { public: 'test', private: 'test' },
				err: false
			}])

			// call handler
			await two_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.invalid_input))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Invalid token', async() => {

			// set up mocks
			const dummy_req = { 
				pke_key: 'test',
				pake_key: 'test',
				encrypted_id: 'test'
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ pke_public: 'test' }],
				val: [{ pke_secret: 'test' }],
				err: false
			},{
				fxn: 'where',
				args: [{ token: 'test' }],
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'decrypt',
				val: 'test',
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: { public: 'test', private: 'test' },
				err: false
			}])

			// call handler
			await two_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.invalid_input))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: DB Failure', async() => {

			// set up mocks
			const dummy_req = { 
				pke_key: 'test',
				pake_key: 'test',
				encrypted_id: 'test'
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				val: errors.internal_error,
				err: true
			},{
				fxn: 'where',
				val: errors.internal_error,
				err: true
			}])
			const dummy_lib = { lib_auth: {}}

			// call handler
			await two_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
		
		test('Error: Auth Failure', async() => {

			// set up mocks
			const dummy_req = { 
				pke_key: 'test',
				pake_key: 'test',
				encrypted_id: 'test'
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ pke_public: 'test' }],
				val: [{ pke_secret: 'test' }],
				err: false
			},{
				fxn: 'where',
				args: [{ token: 'test' }],
				val: [{ zkpp: 'test', salt: 'test' }],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'decrypt',
				val: errors.internal_error,
				err: true
			},{
				lib: 'lib_auth',
				fxn: 'pake_server_generate_keys',
				val: errors.internal_error,
				err: true
			}])

			// call handler
			await two_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

	})
})
