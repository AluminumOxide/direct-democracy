const get_client = require('@aluminumoxide/direct-democracy-lib-client')
const server = get_client(require('./spec.json'), require('./errors.json'))
const auth = require('@aluminumoxide/direct-democracy-lib-auth')

/* client sign in helpers */

const client_sign_in_one = async function({ email, password }) {

	// generate pake keys
	const { public: public_key, private: private_key } = auth.pake_client_generate_keys()

	// initialize signin
	const { salt, key: server_key } = await server.sign_in_init({ email, key: public_key })

	// calculate session and proof
	const client_sesh = auth.pake_client_derive_proof(salt, email, password, private_key, server_key)

	// send proof to server
	const { server_proof, encrypted_question, encrypted_profile } = await server.sign_in_verify({ email, key: client_sesh.proof })

	// verify server proof
	auth.pake_client_verify_proof(public_key, client_sesh, server_proof)

	// decrypt question
	const { key: pass_key } = await auth.key_password(password, salt)
	const question = await auth.decrypt(encrypted_question, pass_key)

	return { question, salt, encrypted_profile }
}

const client_sign_in_two = async function({ answer, salt, encrypted_profile }) {

	// decrypt profile id
	const { key } = await auth.key_password(answer, salt)

	// return profile id
	return await auth.decrypt(encrypted_profile, key)	
}

/* client sign up helpers */

const client_sign_up_one = async function({ email, password, question }) {

	// generate zkpp and salt
	const { zkpp, salt } = auth.pake_client_generate_zkpp(email, password)
	
	// encrypt question
	const { key } = await auth.key_password(password, salt) // TODO: is reusing a salt here stupid?
	const encrypted_question = await auth.encrypt(question, key)
	
	// sign up init
	await server.sign_up_init({ email, zkpp, salt, encrypted_question })

	return { salt }
}

const client_sign_up_two = async function({ answer, salt, profile_id, email_token, account_token }) {

	// encrypt profile id
	const { key } = await auth.key_password(answer, salt) // TODO: is resuing a salt here stupid?
	const encrypted_profile = await auth.encrypt(profile_id, key)
	
	// sign up verify
	return await server.sign_up_verify({ email_token, account_token, encrypted_profile })
}

module.exports = {
	...server,
	client_sign_in_one,
	client_sign_in_two,
	client_sign_up_one,
	client_sign_up_two
}
