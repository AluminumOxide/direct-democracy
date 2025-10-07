const readline = require('node:readline/promises')
const profile_client = require('@aluminumoxide/direct-democracy-profile-api-client')
const account_client = require('@aluminumoxide/direct-democracy-account-api-client')
const token_client = require('@aluminumoxide/direct-democracy-token-api-client')

const signin = async function (rl) {

	// get email
	const email = await rl.question('email: ')

	// get password
	const password = await rl.question('password: ')

	// initiate sign in
	const { question, salt, encrypted_profile } = await account_client.client_sign_in_one({ email, password })	
	const answer = await rl.question(question+' ')

	// complete sign in
	const profile_id = await account_client.client_sign_in_two({ answer, salt, encrypted_profile })
	const jwt = await profile_client.client_sign_in({ profile_id, answer })

	console.log("jwt:")
	console.log(jwt.jwt)

}

module.exports = signin
