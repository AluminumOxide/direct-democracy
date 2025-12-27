const sinon = require('sinon')
const { errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_api,
	get_dummy_reply,
	integration_test_setup,
	integration_test_query,
	fill_buckets_integration: fill_i,
	fill_buckets_unit: fill_u } = require('../helper')

describe('Fill Buckets', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success: Size set', async() => {

			// count tokens before call
			const cnt_query = 'select count(token) as cnt from token'
			let first_acc = await integration_test_query('account', cnt_query)
			first_acc = parseInt(first_acc.rows[0].cnt)
			let first_pro = await integration_test_query('profile', cnt_query)
			first_pro = parseInt(first_pro.rows[0].cnt)
			let first_tkn = await integration_test_query('token', cnt_query)
			first_tkn = parseInt(first_tkn.rows[0].cnt)

			// call fill buckets
			expect(await fill_i(1)).resolves

			// count tokens after call
			let second_acc = await integration_test_query('account', cnt_query)
			second_acc = parseInt(second_acc.rows[0].cnt)
			let second_pro = await integration_test_query('profile', cnt_query)
			second_pro = parseInt(second_pro.rows[0].cnt)
			let second_tkn = await integration_test_query('token', cnt_query)
			second_tkn = parseInt(second_tkn.rows[0].cnt)

			// checks
			expect(second_acc).toBe(first_acc + 2)
			expect(second_pro).toBe(first_pro + 2)
			expect(second_tkn).toBe(first_tkn + 4)

		})

		/* passes but takes forever
		test('Success: No size', async() => {

			// count tokens before call
			const cnt_query = 'select count(token) as cnt from token'
			let first_acc = await integration_test_query('account', cnt_query)
			first_acc = parseInt(first_acc.rows[0].cnt)
			let first_pro = await integration_test_query('profile', cnt_query)
			first_pro = parseInt(first_pro.rows[0].cnt)
			let first_tkn = await integration_test_query('token', cnt_query)
			first_tkn = parseInt(first_tkn.rows[0].cnt)

			// call fill buckets
			expect(await fill_i()).resolves

			// count tokens after call
			let second_acc = await integration_test_query('account', cnt_query)
			second_acc = parseInt(second_acc.rows[0].cnt)
			let second_pro = await integration_test_query('profile', cnt_query)
			second_pro = parseInt(second_pro.rows[0].cnt)
			let second_tkn = await integration_test_query('token', cnt_query)
			second_tkn = parseInt(second_tkn.rows[0].cnt)

			// checks
			expect(second_acc).toBe(first_acc + 2000)
			expect(second_pro).toBe(first_pro + 2000)
			expect(second_tkn).toBe(first_tkn + 4000)

		}, 50000) */

		test('Error: Non-number size', async () => {
			await expect(fill_i('asdf')).rejects.toThrow(Error)
		})
		
		test('Error: Non-integer size', async () => {
			await expect(fill_i(1.5)).rejects.toThrow(Error)
		})

		test('Error: Negative size', async () => {
			await expect(fill_i(-1)).rejects.toThrow(Error)
		})
	})

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
				fxn: 'returning',
				args: ['token'],
				val: [token],
				err: false
			},{
				fxn: 'insert',
				args: [{ bucket: 'email', zkpp, salt, token }],
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'conceal_token',
				val: { id: token, zkpp, salt },
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'token_random',
				val: token,
				err: false
			},{
				lib: 'api_account',
				fxn: 'fill_bucket',
				val: true,
				err: false
			},{
				lib: 'api_profile',
				fxn: 'fill_bucket',
				val: true,
				err: false
			}])

			// call handler
			await fill_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith()
			expect(dummy_reply.code).toHaveBeenCalledWith(200)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
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
				fxn: 'returning',
				args: ['token'],
				val: [token],
				err: false
			},{
				fxn: 'insert',
				args: [{ bucket: 'email', zkpp, salt, token }],
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'conceal_token',
				val: { id: token, zkpp, salt },
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'token_random',
				val: token,
				err: false
			},{
				lib: 'api_account',
				fxn: 'fill_bucket',
				val: true,
				err: false
			},{
				lib: 'api_profile',
				fxn: 'fill_bucket',
				val: true,
				err: false
			}])

			// call handler
			await fill_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith()
			expect(dummy_reply.code).toHaveBeenCalledWith(200)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
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
				fxn: 'returning',
				args: ['token'],
				val: errors.internal_error,
				err: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'conceal_token',
				val: { id: token, zkpp, salt },
				err: false
			},{
				lib: 'lib_auth',
				fxn: 'token_random',
				val: token,
				err: false
			},{
				lib: 'api_account',
				fxn: 'fill_bucket',
				val: true,
				err: false
			},{
				lib: 'api_profile',
				fxn: 'fill_bucket',
				val: true,
				err: false
			}])

			// call handler
			await fill_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		test('Error: Auth lib failure', async() => {

			// set up mocks
			const token = 'asdfasdfasdfasdfasdfasdfasdfsadfasdfsadf'
			const zkpp = 'qwerqwerqwerqwerqwerqwer'
			const salt = 'asdfasdf'
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning',
				args: ['token'],
				val: [token],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'lib_auth',
				fxn: 'token_random',
				val: errors.internal_error,
				err: true
			},{
				lib: 'lib_auth',
				fxn: 'conceal_token',
				val: errors.internal_error,
				err: true
			},{
				lib: 'api_account',
				fxn: 'fill_bucket',
				val: true,
				err: false
			},{
				lib: 'api_profile',
				fxn: 'fill_bucket',
				val: true,
				err: false
			}])

			// call handler
			await fill_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
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
