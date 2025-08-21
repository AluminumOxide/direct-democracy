const { get_uuid,
	get_random_token,
	integration_test_jwt,
	integration_test_setup } = require('./helper')
const c = require('@aluminumoxide/direct-democracy-profile-api-client')

describe('End-to-End Tests', () => {

	const test_data = integration_test_setup()

	test('Success', async() => {

		/* set up */

		// add profile and signup tokens
		const profile_token = get_random_token()
		const signup_token = get_random_token()
		await c.fill_bucket({ bucket: 'profile', tokens: [profile_token] })
		await c.fill_bucket({ bucket: 'signup', tokens: [signup_token] })

		// user input
		const answer = 'test test test test test test test.'

		/* sign up*/

		const { token, profile_id } = await c.client_sign_up({ answer, profile_token })
		expect(token).toBe(signup_token)

		/* sign in */	

		const { jwt } = await c.client_sign_in({ profile_id, answer })	
		expect(jwt).toBeDefined()

		/* verify sign in */

		await expect(c.sign_in_verify({ jwt })).resolves

		/* sign out */

		expect(await c.sign_out({ jwt })).resolves

		/* should no longer verify */

		await expect(c.sign_in_verify({ jwt })).rejects.toThrow(c.errors.invalid_auth)
	})
})
