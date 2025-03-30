const {
	sinon,
	errors,
	get_uuid,
	get_first_uuid,
	get_timestamp,
	get_first_timestamp,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_api,
	integration_test_setup,
	integration_test_query,
	democracy_list_integration,
	democracy_read_integration,
	membership_list_integration,
	membership_create_integration,
	membership_read_integration,
	membership_delete_integration,
	proposal_list_integration,
	proposal_list_public_integration,
	proposal_create_integration,
	proposal_read_integration,
	proposal_read_public_integration,
	proposal_delete_integration,
	ballot_list_integration,
	ballot_list_public_integration,
	ballot_create_integration,
	ballot_read_integration,
	ballot_update_integration,
	ballot_delete_integration
} = require('./helper')

const profile_client = require('@aluminumoxide/direct-democracy-profile-api-client')
const account_client = require('@aluminumoxide/direct-democracy-account-api-client')
const token_client = require('@aluminumoxide/direct-democracy-token-api-client')

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
		const sign_up_one = async function({ email, password, question }) {

			// account sign up
			return await account_client.client_sign_up_one({ email, password, question })
		}

		const sign_up_two = async function({ email_token, answer, salt }) {

			// clean email token
			const profile_token = await token_client.clean_token(email_token)

			// profile sign up
			const { profile_id, token: signup_token } = await profile_client.client_sign_up({ answer, profile_token })

			// clean signup token
			const account_token = await token_client.clean_token(signup_token)

			// complete account sign up
			return await account_client.client_sign_up_two({ answer, salt, profile_id, email_token, account_token })
		}

		let su = await sign_up_one({ email, password, question })
		su.email_token = email_token
		su.answer = answer
		await sign_up_two(su)

		/* sign in */

		const sign_in_one = async function({ email, password }) {

			// sign in account
			return await account_client.client_sign_in_one({ email, password })

		}

		const sign_in_two = async function({ answer, salt, encrypted_profile }) {

			// complete account sign in
			const profile_id = await account_client.client_sign_in_two({ answer, salt, encrypted_profile })

			// sign in profile
			return await profile_client.client_sign_in({ profile_id, answer })
		}

		// sign in
		const si = await sign_in_one({ email, password })
		si.answer = answer
		delete si.question
		const { jwt } = await sign_in_two(si)

		// verify jwt
		await expect(profile_client.verify({ jwt })).resolves

		/* sign out */

		// sign out
		expect(await profile_client.sign_out({ jwt })).resolves

		// verify jwt no longer works
		await expect(profile_client.verify({ jwt })).rejects.toThrow(profile_client.errors.token_dne)
	}, 50000)

})

