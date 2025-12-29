const { errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_lib,
	integration_test_setup,
	sign_in_verify_unit: verify_u,
	sign_in_verify_integration: verify_i
} = require('../helper')

describe('Sign In Verify', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const v = await verify_i(test_data.profile.profile.id, test_data.profile.profile.auth_token, test_data.profile.profile.auth_expiry)
			expect(v).toBe({ profile_id: test_data.profile.profile.id })
		})
		
		test('Error: Invalid Token', async() => {
			await expect(verify_i(test_data.profile.profile.id, 'bad', test_data.profile.profile.auth_expiry)).rejects.toThrow(errors.invalid_auth)
		})
		
		test('Error: Invalid Expiry', async() => {
			await expect(verify_i(test_data.profile.profile.id, test_data.profile.profile.auth_token, '2200-01-01T01:01:01.000Z')).rejects.toThrow(errors.invalid_auth)
		})
		
		test('Error: Token Expired', async() => {
			await expect(verify_i(test_data.profile.profile.id, test_data.profile.profile.auth_token, new Date().toString())).rejects.toThrow(errors.invalid_auth)
		})
	})

	describe('Unit Tests', () => {

		let expiry = new Date()
		expiry.setHours(expiry.getHours() + 1)

		test('Success', async() => {

			// set up mocks
			const dummy_req = { jwt: 'test' }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'jwt',
				fxn: 'verify',
				val: { profile_id: 'test', auth_token: 'test', auth_expiry: expiry },
				err: false
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'select',
				val: [{ auth_token: 'test', auth_expiry: expiry }],
				err: false
			}])

			// call handler
			await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith({ profile_id: 'test' })
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
				val: { profile_id: 'test', auth_token: 'test', auth_expiry: expiry },
				err: false
			}])
                        const dummy_db = get_dummy_db([{
                                fxn: 'select',
                                err: false,
                                val: []
                        }])

                        // call handler
                        await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

                        // check reply
                        expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.invalid_auth))
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
				val: { profile_id: 'test', auth_token: 'test', auth_expiry: expiry },
				err: false
			}])
                        const dummy_db = get_dummy_db([{
                                fxn: 'select',
                                err: false,
                                val: [{},{}]
                        }])

                        // call handler
                        await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
				val: { profile_id: 'test', auth_token: 'test', auth_expiry: expiry },
				err: false
			}])
                        const dummy_db = get_dummy_db([{
                                fxn: 'select',
                                err: false,
                                val: [{ auth_token: 'bad', auth_expiry: 'bad' }]
                        }])

                        // call handler
                        await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

                        // check reply
                        expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.invalid_auth))
                        expect(dummy_reply.code).toHaveBeenCalledWith(400)

                        // check log
                        expect(dummy_log.info).toHaveBeenCalledTimes(0)
                        expect(dummy_log.warn).toHaveBeenCalledTimes(1)
                        expect(dummy_log.error).toHaveBeenCalledTimes(0)
                })
		
		test('Error: Expired Token', async() => {

                        // set up mocks
			let expired = new Date()
			expired.setHours(expired.getHours() - 1)
			const dummy_req = { jwt: 'test' }
                        const dummy_log = get_dummy_log()
                        const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'jwt',
				fxn: 'verify',
				val: { profile_id: 'test', auth_token: 'test', auth_expiry: expired },
				err: false
			}])
                        const dummy_db = get_dummy_db([{
                                fxn: 'select',
                                err: false,
                                val: [{ auth_token: 'bad', auth_expiry: 'bad' }]
                        }])

                        // call handler
                        await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

                        // check reply
                        expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.invalid_auth))
                        expect(dummy_reply.code).toHaveBeenCalledWith(400)

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
				val: { profile_id: 'test', auth_token: 'test', auth_expiry: expiry },
				err: false
			}])
                        const dummy_db = get_dummy_db([{
                                fxn: 'select',
                                err: true,
                                val: [{},{}]
                        }])

                        // call handler
                        await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

                        // check reply
                        expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
                        expect(dummy_reply.code).toHaveBeenCalledWith(500)

                        // check log
                        expect(dummy_log.info).toHaveBeenCalledTimes(0)
                        expect(dummy_log.warn).toHaveBeenCalledTimes(0)
                        expect(dummy_log.error).toHaveBeenCalledTimes(1)
                })
		
		test('Error: Auth Error', async() => {

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
                        await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

                        // check reply
                        expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.invalid_auth))
                        expect(dummy_reply.code).toHaveBeenCalledWith(401)

                        // check log
                        expect(dummy_log.info).toHaveBeenCalledTimes(0)
                        expect(dummy_log.warn).toHaveBeenCalledTimes(1)
                        expect(dummy_log.error).toHaveBeenCalledTimes(0)
                })
	})
})
