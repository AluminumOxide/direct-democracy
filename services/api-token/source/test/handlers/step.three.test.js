const { errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	integration_test_setup,
	step_three_unit: three_u } = require('../helper')

describe('Step Three', () => {

	describe('Unit Tests', () => {

		test('Success: Email Token', async() => {

			// set up mocks
			const dummy_req = { pake_key: 'test', pake_proof: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'del',
				last_val: [{ token: 'test' }],
				throws_errors: false
			},{
				last_fxn: 'where',
				last_args: [{ pake_public: 'test' }],
				last_val: [{
					token_id: 'test',
					pke_secret: 'test',
					pake_private: 'test'
				}],
				throws_errors: false
			},{
				last_fxn: 'where',
				last_args: [{ token: 'test' }],
				last_val: [{
					bucket: 'email',
					zkpp: 'test',
					salt: 'test'
				}],
				throws_errors: false
			}])
			get_dummy_lib('auth', [{
				fxn: 'pake_server_derive_proof',
				val: 'test',
				error: false
			},{
				fxn: 'jwt_sign',
				val: 'test',
				error: false
			},{
				fxn: 'encrypt',
				val: 'test',
				error: false
			}])

			// call handler
			await three_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
				last_fxn: 'del',
				last_val: [{ token: 'test' }],
				throws_errors: false
			},{
				last_fxn: 'where',
				last_args: [{ pake_public: 'test' }],
				last_val: [{
					token_id: 'test',
					pke_secret: 'test',
					pake_private: 'test'
				}],
				throws_errors: false
			},{
				last_fxn: 'where',
				last_args: [{ token: 'test' }],
				last_val: [{
					bucket: 'signup',
					zkpp: 'test',
					salt: 'test'
				}],
				throws_errors: false
			}])
			get_dummy_lib('auth', [{
				fxn: 'pake_server_derive_proof',
				val: 'test',
				error: false
			},{
				fxn: 'jwt_sign',
				val: 'test',
				error: false
			},{
				fxn: 'encrypt',
				val: 'test',
				error: false
			}])

			// call handler
			await three_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
		
		test('Error: DB Failure', async() => {

			// set up mocks
			const dummy_req = { pake_key: 'test', pake_proof: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'del',
				throws_errors: true
			},{
				last_fxn: 'where',
				last_args: [{ pake_public: 'test' }],
				throws_errors: true
			},{
				last_fxn: 'where',
				last_args: [{ token: 'test' }],
				throws_errors: true
			}])

			// call handler
			await three_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		// TODO: Auth lib failure

	})
})
