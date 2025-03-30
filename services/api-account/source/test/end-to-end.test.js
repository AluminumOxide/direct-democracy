const { get_uuid,
	get_random_token,
	fill_bucket_integration: fill_bucket,
	client_sign_up_one_integration: client_sign_up_one,
	client_sign_up_two_integration: client_sign_up_two,
	client_sign_in_one_integration: client_sign_in_one,
	client_sign_in_two_integration: client_sign_in_two,
	integration_test_setup } = require('./helper')
const c = require('@aluminumoxide/direct-democracy-account-api-client')

describe('End-to-End Tests', () => {

	const test_data = integration_test_setup()

	test('Success', async() => {

		/* set up */

		// add email and account tokens
		const email_token = get_random_token()
		const account_token = get_random_token()
		await fill_bucket('email', [email_token])
		await fill_bucket('account', [account_token])

		// user input
		const email = 'testy@mctestface.com'
		const password = 'passpasspasspasspasspasspasspass'
		const question = 'test test test test test test?'
		const answer = 'test test test test test test test.'

		/* sign up*/

		// step one
		const { salt } = await client_sign_up_one(email, password, question)

		// continue sign up with profile service to get id and account token
		const profile_id = get_uuid()

		// step two
		await client_sign_up_two(answer, salt, profile_id, email_token, account_token)

		/* sign in */	

		// step one to get security question
		const { question: question2, 
			salt: salt2,
			encrypted_profile
		} = await client_sign_in_one(email, password)
		expect(question2).toBe(question)

		// step two answer security question to get profile id
		const profile2 = await client_sign_in_two(answer, salt2, encrypted_profile)
		expect(profile2).toBe(profile_id)
		
		// continue sign in with profile id
	})
})
