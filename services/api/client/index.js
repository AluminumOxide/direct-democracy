const get_client = require('@aluminumoxide/direct-democracy-lib-client')
const server = get_client(require('./spec.json'), require('./errors.json'))
const profile_client = require('@aluminumoxide/direct-democracy-profile-api-client')
const account_client = require('@aluminumoxide/direct-democracy-account-api-client')
const token_client = require('@aluminumoxide/direct-democracy-token-api-client')

/* Sign Up */

// returns: { salt }
const sign_up_one = async function({ email, password, question }) {
	return await account_client.client_sign_up_one({ email, password, question })
}

// returns: profile_token
const sign_up_two = async function({ email_token }) {
	return await token_client.clean_token(email_token)
}

// returns: { profile_id, signup_token }
const sign_up_three = async function({ answer, profile_token }) {
	const { profile_id, token: signup_token } =  await profile_client.client_sign_up({ answer, profile_token })
	return { profile_id, signup_token }
}

// returns: account_token
const sign_up_four = async function({ signup_token }) {
	return await token_client.clean_token(signup_token)
}

// returns: nothing on success
const sign_up_five = async function({ answer, salt, profile_id, email_token, account_token }) {
	return await account_client.client_sign_up_two({ answer, salt, profile_id, email_token, account_token })
}

/* Sign In */

// returns: { question, salt, encrypted_profile }
const sign_in_one = async function({ email, password }) {
	return await account_client.client_sign_in_one({ email, password })
}

// returns: profile_id
const sign_in_two = async function({ answer, salt, encrypted_profile }) {
	return await account_client.client_sign_in_two({ answer, salt, encrypted_profile })
}

// returns: { jwt }
const sign_in_three = async function({ profile_id, answer }) {
	return await profile_client.client_sign_in({ profile_id, answer })
}

/* Sign In Verify */
const verify_jwt = async function({ jwt }) {
	return await profile_client.sign_in_verify({ jwt })
}

/* Sign Out */
const sign_out = async function({ jwt }) {
	return await profile_client.sign_out({ jwt })
}



module.exports = {
	...server,
	sign_up_one,
	sign_up_two,
	sign_up_three,
	sign_up_four,
	sign_up_five,
	sign_in_one,
	sign_in_two,
	sign_in_three,
	sign_out,
	verify_jwt
}
