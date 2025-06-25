const { errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	verify_integration: verify,
	sign_out_integration: sign_out_i,
	sign_out_unit: sign_out_u
} = require('../helper')

describe('Sign Out', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const jwt = {
				profile_id: test_data.profile.profile.id,
				auth_token: test_data.profile.profile.auth_token,
				auth_expiry: test_data.profile.profile.auth_expiry
			}
			await sign_out_i(jwt)
			await expect(verify(jwt)).rejects.toThrow(Error)
		})

		test('Error: Invalid JWT Profile', async() => {
			await expect(sign_out_i({ profile_id: 'bad', auth_token: test_data.profile.profile.auth_token, auth_expiry: test_data.profile.profile.auth_expiry })).rejects.toThrow(Error)
		})
		
		test('Error: Invalid JWT Auth', async() => {
			await expect(sign_out_i({ profile_id: test_data.profile.profile.id, auth_token: 'bad', auth_expiry: test_data.profile.profile.auth_expiry })).rejects.toThrow(Error)
		})
		
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			const dummy_req = { jwt: { profile_id: 'test', auth_token: 'test', auth_expiry: 'test' } }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
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
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'select',
				err: false,
				val: []
			}])

			// call handler
			await sign_out_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'select',
				err: false,
				val: [{},{}]
			}])

			// call handler
			await sign_out_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'select',
				err: false,
				val: [{ auth_token: 'bad', auth_expiry: 'bad' }]
			}])

			// call handler
			await sign_out_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'select',
				err: true,
				val: [{},{}]
			}])

			// call handler
			await sign_out_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
