const { errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_api,
	get_dummy_reply,
	fill_buckets_unit: fill_u } = require('../helper')

describe('Fill Buckets', () => {

	describe('Unit Tests', () => {

		test('Success: No bucket size', async() => {

			// set up mocks
			const token = 'asdfasdfasdfasdfasdfasdfasdfsadfasdfsadf'
			const zkpp = 'qwerqwerqwerqwerqwerqwer'
			const salt = 'asdfasdf'
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['token'],
				last_val: [token],
				throws_error: false
			},{
				last_fxn: 'insert',
				last_args: [{ bucket: 'email', zkpp, salt, token }],
				last_val: [],
				throws_error: false
			}])
			get_dummy_lib('auth', [{

				fxn: 'conceal_token',
				val: { id: token, zkpp, salt },
				err: false
			},{
				fxn: 'token_random',
				val: token,
				err: false
			}])
			get_dummy_api('account',[{
				fxn: 'fill_bucket',
				val: true,
				err: false
			}])
			get_dummy_api('profile',[{
				fxn: 'fill_bucket',
				val: true,
				err: false
			}])

			// call handler
			await fill_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith()
			expect(dummy_reply.code).toBeCalledWith(200)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Success: Bucket size', async() => {

			// set up mocks
			const token = 'asdfasdfasdfasdfasdfasdfasdfsadfasdfsadf'
			const zkpp = 'qwerqwerqwerqwerqwerqwer'
			const salt = 'asdfasdf'
			const dummy_req = { bucket_size: 1 }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['token'],
				last_val: [token],
				throws_error: false
			},{
				last_fxn: 'insert',
				last_args: [{ bucket: 'email', zkpp, salt, token }],
				last_val: [],
				throws_error: false
			}])
			get_dummy_lib('auth', [{

				fxn: 'conceal_token',
				val: { id: token, zkpp, salt },
				err: false
			},{
				fxn: 'token_random',
				val: token,
				err: false
			}])
			get_dummy_api('account',[{
				fxn: 'fill_bucket',
				val: true,
				err: false
			}])
			get_dummy_api('profile',[{
				fxn: 'fill_bucket',
				val: true,
				err: false
			}])

			// call handler
			await fill_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith()
			expect(dummy_reply.code).toBeCalledWith(200)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: DB insert failure', async() => {

			// set up mocks
			const token = 'asdfasdfasdfasdfasdfasdfasdfsadfasdfsadf'
			const zkpp = 'qwerqwerqwerqwerqwerqwer'
			const salt = 'asdfasdf'
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['token'],
				last_val: [token],
				throws_error: true
			}])
			get_dummy_api('account',[{
				fxn: 'fill_bucket',
				val: true,
				err: false
			}])
			get_dummy_api('profile',[{
				fxn: 'fill_bucket',
				val: true,
				err: false
			}])

			// call handler
			await fill_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		// TODO: why doesn't dummy lib work?
		//test('Error: Auth lib failure', async() => {

		//	// set up mocks
		//	const token = 'asdfasdfasdfasdfasdfasdfasdfsadfasdfsadf'
		//	const zkpp = 'qwerqwerqwerqwerqwerqwer'
		//	const salt = 'asdfasdf'
		//	const dummy_req = {}
		//	const dummy_log = get_dummy_log()
		//	const dummy_reply = get_dummy_reply()
		//	const dummy_db = get_dummy_db([{
		//		last_fxn: 'returning',
		//		last_args: ['token'],
		//		last_val: [token],
		//		throws_error: false
		//	}])
		//	get_dummy_lib('auth', [{
		//		fxn: 'hash_chain',
		//		val: new Error(errors.internal_error),
		//		err: true
		//	},{
		//		fxn: 'token_random',
		//		val: new Error(errors.internal_error),
		//		err: true
		//	},{
		//		fxn: 'pake_client_generate_zkpp',
		//		val: new Error(errors.internal_error),
		//		err: true
		//	}])

		//	// call handler
		//	await fill_u(dummy_req, dummy_reply, dummy_db, dummy_log)
		//	
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
