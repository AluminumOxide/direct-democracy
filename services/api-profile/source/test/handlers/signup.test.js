const { errors,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	get_dummy_db,
	get_uuid,
	integration_test_setup,
	integration_test_jwt,
	fill_bucket_integration: fill_bucket,
	sign_up_unit: sign_up_u,
	sign_up_integration: sign_up_i
} = require('../helper')

describe('Sign Up', () => {

	describe('Integration Tests', () => { 

		const test_data = integration_test_setup()

		test('Success', async() => {
			const p_token = await integration_test_jwt({jwt:'profiletokennnnnnnnn'}, 'token')
			const s_token = await integration_test_jwt({jwt:'signuptokennnnnnnnnn'}, 'token')
			await fill_bucket('profile',[p_token])
			await fill_bucket('signup',[s_token])
			const { token } = await sign_up_i(
				get_uuid(),
				test_data.profile.profile.auth_zkpp,
				test_data.profile.profile.auth_salt,
				p_token)
			expect(token).toBe(s_token)
		})

		test('Error: Duplicate Profile ID', async() => {
			const p_token = 'profiletokennnnnnnnn'
			const s_token = 'signuptokennnnnnnnnn'
			await fill_bucket('profile',[p_token])
			await fill_bucket('signup',[s_token])
			await expect(sign_up_i(test_data.profile.profile.id, test_data.profile.profile.auth_zkpp, test_data.profile.profile.auth_salt, p_token)).rejects.toThrow(errors.id_dupe)
		})

		test('Error: Invalid Profile Token', async() => {
			const s_token = 'signuptokennnnnnnnnn'
			await fill_bucket('signup',[s_token])
			await expect(sign_up_i(get_uuid(), test_data.profile.profile.auth_zkpp, test_data.profile.profile.auth_salt, 'bad')).rejects.toThrow(errors.token_dne)
		})

		test('Error: No Signup Token', async() => {
			const p_token = 'profiletokennnnnnnnn'
			await fill_bucket('profile',[p_token])
			await expect(sign_up_i(get_uuid(), test_data.profile.profile.auth_zkpp, test_data.profile.profile.auth_salt, p_token)).rejects.toThrow(errors.internal_error)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				err: false,
				val: []
			},{
				fxn: 'del',
				err: false,
				val: [{ token: 'test' }]
			},{
				fxn: 'returning',
				err: false,
				val: [{}]
			}])
			
			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith({ token: 'test' })
			expect(dummy_reply.code).toHaveBeenCalledWith(200)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Profile ID is not unique', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				err: false,
				val: [{}]
			}])
			
			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.id_dupe))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Profile token DNE', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				err: false,
				val: []
			},{
				fxn: 'del',
				err: false,
				val: []
			}])
			
			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.token_dne))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Duplicate profile token', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				err: false,
				val: []
			},{
				fxn: 'del',
				err: false,
				val: [{},{}]
			}])
			
			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		test('Error: Empty signup bucket', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				err: false,
				val: []
			},{
				fxn: 'del',
				err: false,
				call: 1,
				val: [{ token: 'test' }]
			},{
				fxn: 'del',
				err: false,
				call: 2,
				val: []
			}])
			
			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		test('Error: Insertion failure', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				err: false,
				val: []
			},{
				fxn: 'del',
				err: false,
				val: [{ token: 'test' }]
			},{
				fxn: 'returning',
				err: false,
				val: []
			}])
			
			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		}) 
		
		test('Error: DB Error', async() => {

			// set up mocks
			const dummy_req = { profile_id: 'test', zkpp: 'test', salt: 'test', profile_token: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: 'test' }],
				err: true
			}])
			
			// call handler
			await sign_up_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		}) 
	})
})
