const { errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	integration_test_setup,
	step_one_integration: one_i,
	step_one_unit: one_u } = require('../helper')
const auth = require('@aluminumoxide/direct-democracy-lib-auth')

describe('Step One', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const { pke_key } = await one_i(test_data.auth.email.pke_public)
			expect(await auth.pke_derive_secret(pke_key, test_data.auth.email.pke_private)).resolves
		})

		test('Error: No key', async() => {
			await expect(one_i()).rejects.toThrow(Error)
		})

		test('Error: Non-string key', async() => {
			await expect(one_i(123)).rejects.toThrow(Error)
		})

		test('Error: Invalid key', async() => {
			await expect(one_i('asdfasfdasdfasasdf')).rejects.toThrow(Error)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const expected = { private: 'asdfasdf', public: 'asdfasdf' }
			const dummy_req = { pke_key: 'TODO' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'insert',
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pke_generate_keys',
				val: expected,
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'pke_derive_secret',
				val: expected.public,
				err: false
			}])

			// call handler
			await one_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith({ pke_key: expected.public })

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: DB failure', async() => {

			// set up mocks
			const expected = { private: 'asdfasdf', public: 'asdfasdf' }
			const dummy_req = { pke_key: 'TODO' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'insert',
				val: errors.internal_error,
				err: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pke_generate_keys',
				val: expected,
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'pke_derive_secret',
				val: expected.public,
				err: false
			}])

			// call handler
			await one_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			const expected = { private: 'asdfasdf', public: 'asdfasdf' }
			const dummy_req = { pke_key: 'TODO' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'insert',
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'pke_generate_keys',
				val: errors.internal_error,
				err: true
			}])

			// call handler
			await one_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
