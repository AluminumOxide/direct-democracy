const { errors,
	get_dummy_db,
	get_dummy_lib,
	get_dummy_log,
	get_dummy_reply,
	step_two_unit: two_u } = require('../helper')

describe('Step Two', () => {

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
				last_fxn: 'where',
				last_args: [{ pke_public: 'test' }],
				last_val: [{ pke_secret: 'test' }],
				throws_error: false
			},{
				last_fxn: 'where',
				last_args: [{ token: 'test' }],
				last_val: [{ zkpp: 'test', salt: 'test' }],
				throws_error: false
			}])
			get_dummy_lib('auth', [{
				fxn: 'decrypt',
				val: 'test',
				err: false
			},{
				fxn: 'pake_server_generate_keys',
				val: { public: 'test', private: 'test' },
				err: false
			}])

			// call handler
			await two_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith({
				pake_key: 'test',
				salt: 'test'
			})

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
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
				last_fxn: 'where',
				last_val: [{ pke_secret: 'test' }],
				throws_error: true
			},{
				last_fxn: 'where',
				last_val: [{ zkpp: 'test' }],
				throws_error: true
			}])

			// call handler
			await two_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		// TODO: auth lib failure

	})
})
