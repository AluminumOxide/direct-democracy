const { errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	sign_up_unit: sign_up
} = require('../helper')

describe('Sign Up', () => {

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ id: 'test' }],
				throws_error: false,
				last_val: []
			},{
				last_fxn: 'del',
				throws_error: false,
				last_val: [{ token: 'test' }]
			},{
				last_fxn: 'returning',
				throws_error: false,
				last_val: [{}]
			}])
			
			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith({ token: 'test' })
			expect(dummy_reply.code).toBeCalledWith(200)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Profile ID is not unique', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ id: 'test' }],
				throws_error: false,
				last_val: [{}]
			}])
			
			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.id_dupe))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: Profile token DNE', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ id: 'test' }],
				throws_error: false,
				last_val: []
			},{
				last_fxn: 'del',
				throws_error: false,
				last_val: []
			}])
			
			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.token_dne))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: Duplicate profile token', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ id: 'test' }],
				throws_error: false,
				last_val: []
			},{
				last_fxn: 'del',
				throws_error: false,
				last_val: [{},{}]
			}])
			
			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toBeCalledWith(500)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		test('Error: Empty signup bucket', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ id: 'test' }],
				throws_error: false,
				last_val: []
			},{
				last_fxn: 'del',
				throws_error: false,
				call_no: 1,
				last_val: [{ token: 'test' }]
			},{
				last_fxn: 'del',
				throws_error: false,
				call_no: 2,
				last_val: []
			}])
			
			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toBeCalledWith(500)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		test('Error: Insertion failure', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ id: 'test' }],
				throws_error: false,
				last_val: []
			},{
				last_fxn: 'del',
				throws_error: false,
				last_val: [{ token: 'test' }]
			},{
				last_fxn: 'returning',
				throws_error: false,
				last_val: []
			}])
			
			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

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
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ id: 'test' }],
				throws_error: true
			}])
			
			// call handler
			await sign_up(dummy_req, dummy_reply, dummy_db, dummy_log)

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
