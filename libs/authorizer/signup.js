const readline = require('node:readline/promises')
const profile_client = require('@aluminumoxide/direct-democracy-profile-api-client')
const account_client = require('@aluminumoxide/direct-democracy-account-api-client')
const token_client = require('@aluminumoxide/direct-democracy-token-api-client')

const signup = async function (rl) {

	// get email
	const email = await rl.question('email: ')

	// get password
	const password = await rl.question('password: ')

	// get security question and answer
	const question = await rl.question('security question: ')
	const answer = await rl.question('question answer: ')

	// initiate sign up
	const su1 = await account_client.client_sign_up_one({ email, password, question })

	// get email token
	const email_token = await rl.question('emailed token: ')

	// complete sign up
	const su2 = await token_client.clean_token(email_token)
	const su3 = await profile_client.client_sign_up({ answer, profile_token: su2 })
	const su4 = await token_client.clean_token(su3.token)
	await account_client.client_sign_up_two({ answer, salt: su1.salt, profile_id: su3.profile_id, email_token, account_token: su4 })

	console.log("sign up success!")
	console.log("you may now sign in")
}

module.exports = signup
