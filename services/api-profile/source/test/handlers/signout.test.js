const { errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	sign_out_unit: sign_out
} = require('../helper')

describe('Sign Out', () => {

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { jwt: { profile_id: 'test', auth_token: 'test', auth_expiry: 'test' } }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'select',
				throws_error: false,
				last_val: [{ auth_token: 'test' }]
			},{
				last_fxn: 'where',
				call_no: 2,
				last_val: [],
				throws_error: false
			}])

			// call handler
			await sign_out(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith()
			expect(dummy_reply.code).toBeCalledWith(200)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Profile DNE', async() => {

			// set up mocks
			const dummy_req = { jwt: { profile_id: 'test', auth_token: 'test', auth_expiry: 'test' } }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'select',
				throws_error: false,
				last_val: []
			}])

			// call handler
			await sign_out(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.profile_dne))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Duplicate Profile', async() => {

			// set up mocks
			const dummy_req = { jwt: { profile_id: 'test', auth_token: 'test', auth_expiry: 'test' } }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'select',
				throws_error: false,
				last_val: [{},{}]
			}])

			// call handler
			await sign_out(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toBeCalledWith(500)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Invalid Token', async() => {

			// set up mocks
			const dummy_req = { jwt: { profile_id: 'test', auth_token: 'test', auth_expiry: 'test' } }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'select',
				throws_error: false,
				last_val: [{ auth_token: 'bad', auth_expiry: 'bad' }]
			}])

			// call handler
			await sign_out(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.token_dne))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: DB Error', async() => {

			// set up mocks
			const dummy_req = { jwt: { profile_id: 'test', auth_token: 'test', auth_expiry: 'test' } }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'select',
				throws_error: true,
				last_val: [{},{}]
			}])

			// call handler
			await sign_out(dummy_req, dummy_reply, dummy_db, dummy_log)

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
