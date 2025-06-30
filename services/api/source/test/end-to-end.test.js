const {
	sinon,
	errors,
	integration_test_setup,
	integration_test_query,
} = require('./helper')
const token_client = require('@aluminumoxide/direct-democracy-token-api-client')
const api_client = require('@aluminumoxide/direct-democracy-external-api-client')

describe('End-to-End Tests', () => {

	test('todo', async() => {

		/* set up */
	
		// generate tokens
		await token_client.fill_buckets({ bucket_size: 1 })
		const email_query = await integration_test_query('account',`select * from token where bucket='email'`)
		const email_token = email_query.rows[0].token
		
		// user entry
		const email = 'testy@mctestface.com'
		const password = 'testtesttesttesttesttest'
		const question = 'test test test test test?'
		const answer = 'test test test test.'

		/* sign up */

		const su1 = await api_client.sign_up_one({ email, password, question })
		const su2 = await api_client.sign_up_two({ email_token })
		const su3 = await api_client.sign_up_three({ answer, profile_token: su2 })
		const su4 = await api_client.sign_up_four({ signup_token: su3.signup_token })
		await api_client.sign_up_five({ answer, salt: su1.salt, profile_id: su3.profile_id, email_token, account_token: su4 })
		

		/* sign in */

		const si1 = await api_client.sign_in_one({ email, password })
		const si2 = await api_client.sign_in_two({ answer, salt: si1.salt, encrypted_profile: si1.encrypted_profile })
		const { jwt } = await api_client.sign_in_three({ profile_id: si2, answer })

		// verify jwt
		await expect(api_client.verify_jwt({ jwt })).resolves

		// TODO: more tests for logged in actions

		/* sign out */

		// sign out
		expect(await api_client.sign_out({ jwt })).resolves

		// verify jwt no longer works
		await expect(api_client.verify_jwt({ jwt })).rejects.toThrow(errors.token_dne)
	}, 50000)

})

