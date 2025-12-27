const { errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	sign_in_verify_integration: verify,
	sign_out_integration: sign_out_i,
	sign_out_unit: sign_out_u
} = require('../helper')

describe('Sign Out', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const pro = test_data.profile.profile
			await sign_out_i(pro.id, pro.auth_token, pro.auth_expiry)
			await expect(verify(pro.id, pro.auth_token, pro.auth_expiry)).rejects.toThrow(Error)
		})

		test('Error: Invalid JWT Profile', async() => {
			const pro = test_data.profile.profile
			await expect(sign_out_i('bad', pro.auth_token, pro.auth_expiry)).rejects.toThrow(Error)
		})
		
		test('Error: Invalid JWT Auth', async() => {
			const pro = test_data.profile.profile
			await expect(sign_out_i(pro.id, 'bad', pro.auth_expiry)).rejects.toThrow(Error)
		})
		
	})

	describe('Unit Tests', () => {

		let auth_expiry = new Date()
		auth_expiry.setHours(auth_expiry.getHours() + 1)
		const profile_id = 'test'
		const auth_token = 'test'

		test('Success', async() => {

			// set up mocks
			const dummy_req = { jwt: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'jwt',
				fxn: 'verify',
				val: { profile_id, auth_token, auth_expiry },
				err: false
			}])
			const dummy_db = get_dummy_db([{
				fxn: 'select',
				err: false,
				val: [{ auth_token: 'test' }]
			},{
				fxn: 'where',
				call: 2,
				val: [],
				err: false
			}])

			// call handler
			await sign_out_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith()
			expect(dummy_reply.code).toHaveBeenCalledWith(200)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Profile DNE', async() => {

			// set up mocks
			const dummy_req = { jwt: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'jwt',
				fxn: 'verify',
				val: { profile_id, auth_token, auth_expiry },
				err: false
			}])
			const dummy_db = get_dummy_db([{
				fxn: 'select',
				err: false,
				val: []
			}])

			// call handler
			await sign_out_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.profile_dne))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Duplicate Profile', async() => {

			// set up mocks
			const dummy_req = { jwt: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'jwt',
				fxn: 'verify',
				val: { profile_id, auth_token, auth_expiry },
				err: false
			}])
			const dummy_db = get_dummy_db([{
				fxn: 'select',
				err: false,
				val: [{},{}]
			}])

			// call handler
			await sign_out_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
		
		test('Error: Invalid Token', async() => {

			// set up mocks
			const dummy_req = { jwt: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'jwt',
				fxn: 'verify',
				val: { profile_id, auth_token, auth_expiry },
				err: false
			}])
			const dummy_db = get_dummy_db([{
				fxn: 'select',
				err: false,
				val: [{ auth_token: 'bad', auth_expiry: 'bad' }]
			}])

			// call handler
			await sign_out_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.token_dne))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid JWT', async() => {

			// set up mocks
			const dummy_req = { jwt: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'jwt',
				fxn: 'verify',
				val: false,
				err: false
			}])
			const dummy_db = get_dummy_db([])

			// call handler
			await sign_out_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.token_dne))
			expect(dummy_reply.code).toHaveBeenCalledWith(401)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: DB Error', async() => {

			// set up mocks
			const dummy_req = { jwt: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'jwt',
				fxn: 'verify',
				val: { profile_id, auth_token, auth_expiry },
				err: false
			}])
			const dummy_db = get_dummy_db([{
				fxn: 'select',
				err: true,
				val: [{},{}]
			}])

			// call handler
			await sign_out_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
