const { get_uuid,
	get_random_token,
	integration_test_setup } = require('./helper')
const c = require('@aluminumoxide/direct-democracy-account-api-client')

describe('Integration Tests', () => {

	const test_data = integration_test_setup()

	test('Success', async() => {

		/* set up */

		// add email and account tokens
		const email_token = get_random_token()
		const account_token = get_random_token()
		await c.fill_bucket({ bucket: 'email', tokens: [email_token] })
		await c.fill_bucket({ bucket: 'account', tokens: [account_token] })

		// user input
		const email = 'testy@mctestface.com'
		const password = 'passpasspasspasspasspasspasspass'
		const question = 'test test test test test test?'
		const answer = 'test test test test test test test.'

		/* sign up*/

		// step one
		const { salt } = await c.client_sign_up_one({ email, password, question })

		// continue sign up with profile service to get id and account token
		const profile_id = get_uuid()

		// step two
		await c.client_sign_up_two({ answer, salt, profile_id, email_token, account_token })

		/* sign in */	

		// step one to get security question
		const { question: question2, 
			salt: salt2,
			encrypted_profile
		} = await c.client_sign_in_one({ email, password })
		expect(question2).toBe(question)

		// step two answer security question to get profile id
		const profile2 = await c.client_sign_in_two({ answer, salt: salt2, encrypted_profile })
		expect(profile2).toBe(profile_id)
		
		// continue sign in with profile id
	})
})
