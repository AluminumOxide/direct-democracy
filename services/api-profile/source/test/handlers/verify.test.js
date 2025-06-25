const { errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_lib,
	integration_test_setup,
	verify_unit: verify_u,
	verify_integration: verify_i
} = require('../helper')

describe('Verify', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success', async() => {
			const v = await verify_i(test_data.profile.profile.id, test_data.profile.profile.auth_token, test_data.profile.profile.auth_expiry)
			expect(v).toBeTruthy()
		})
		
		test('Error: Invalid Token', async() => {
			await expect(verify_i(test_data.profile.profile.id, 'bad', test_data.profile.profile.auth_expiry)).rejects.toThrow(errors.token_dne)
		})
		
		test('Error: Invalid Expiry', async() => {
			await expect(verify_i(test_data.profile.profile.id, test_data.profile.profile.auth_token, '2200-01-01T01:01:01.000Z')).rejects.toThrow(errors.token_dne)
		})
		
		test('Error: Token Expired', async() => {
			await expect(verify_i(test_data.profile.profile.id, test_data.profile.profile.auth_token, new Date().toString())).rejects.toThrow(errors.token_expired)
		})
	})

	describe('Unit Tests', () => {

		test('Success', async() => {

			// set up mocks
			let expiry = new Date()
			expiry.setHours(expiry.getHours() + 1)
			const dummy_req = { jwt: {
				profile_id: 'test',
				auth_token: 'test',
				auth_expiry: expiry }}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'select',
				val: [{ auth_token: 'test', auth_expiry: expiry }],
				err: false
			}])

			// call handler
			await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(true)
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
                        await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
                        await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
                        await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

                        // check reply
                        expect(dummy_reply.send).toBeCalledWith(new Error(errors.token_dne))
                        expect(dummy_reply.code).toBeCalledWith(400)

                        // check log
                        expect(dummy_log.info).toBeCalledTimes(0)
                        expect(dummy_log.warn).toBeCalledTimes(1)
                        expect(dummy_log.error).toBeCalledTimes(0)
                })
		
		test('Error: Expired Token', async() => {

                        // set up mocks
			let expired = new Date()
			expired.setHours(expired.getHours() - 1)
                        const dummy_req = { jwt: { profile_id: 'test', auth_token: 'test', auth_expiry: expired } }
                        const dummy_log = get_dummy_log()
                        const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([])
                        const dummy_db = get_dummy_db([{
                                fxn: 'select',
                                err: false,
                                val: [{ auth_token: 'bad', auth_expiry: 'bad' }]
                        }])

                        // call handler
                        await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

                        // check reply
                        expect(dummy_reply.send).toBeCalledWith(new Error(errors.token_expired))
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
                        await verify_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
