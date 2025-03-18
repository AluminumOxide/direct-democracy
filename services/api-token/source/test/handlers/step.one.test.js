const { errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	step_one_unit: one_u } = require('../helper')

describe('Step One', () => {

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const expected = { private: 'asdfasdf', public: 'asdfasdf' }
			const dummy_req = { pke_key: 'TODO' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'insert',
				last_val: [],
				throws_error: false
			}])
			get_dummy_lib('auth', [{
				fxn: 'pke_generate_keys',
				val: expected,
				err: false
			},{
				fxn: 'pke_derive_secret',
				val: expected.public,
				err: false
			}])

			// call handler
			await one_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
				last_fxn: 'insert',
				throws_error: true
			}])
			get_dummy_lib('auth', [{
				fxn: 'pke_generate_keys',
				val: expected,
				err: false
			},{
				fxn: 'pke_derive_secret',
				val: expected.public,
				err: false
			}])

			// call handler
			await one_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	
		// TODO: why doesn't dummy lib work
		//test('Error: Auth Failure', async() => {

		//	// set up mocks
		//	const expected = { private: 'asdfasdf', public: 'asdfasdf' }
		//	const dummy_req = { pke_key: 'TODO' }
		//	const dummy_log = get_dummy_log()
		//	const dummy_reply = get_dummy_reply()
		//	const dummy_db = get_dummy_db([{
		//		last_fxn: 'insert',
		//		last_val: [],
		//		throws_error: false
		//	}])
		//	get_dummy_lib('auth', [{
		//		fxn: 'pke_generate_keys',
		//		val: new Error(errors.internal_error),
		//		err: true
		//	}])

		//	// call handler
		//	await one_u(dummy_req, dummy_reply, dummy_db, dummy_log)

		//	// check reply
		//	expect(dummy_reply.code).toBeCalledWith(500)
		//	expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

		//	// check log
		//	expect(dummy_log.info).toBeCalledTimes(0)
		//	expect(dummy_log.warn).toBeCalledTimes(0)
		//	expect(dummy_log.error).toBeCalledTimes(1)
		//})
	})
})
