const { account_dne, account_unverified, invalid_key, internal_error } = require('../../errors.json')

const sign_in_verify = async function(request, reply, db, log, lib) {

	const { email, key: client_proof } = request
	const { pake_server_derive_proof } = lib.lib_auth 

	try {
		// lookup account by email
		const account_query = await db('account').select(['auth_salt','auth_zkpp','auth_public','auth_private','encrypted_question','encrypted_profile','is_verified']).where({ email })

		// handle missing account
		if(!account_query || account_query.length < 1) {
			log.warn(`Account/Signin/Verify: Failure: ${email} Error: Account DNE`)
			return reply.code(400).send(new Error(account_dne))

		// handle duplicate accounts - should never happen
		} else if(account_query.length > 1) {
			log.error(`Account/Signin/Verify: Failure: ${email} Error: Double Account!`)
			return reply.code(500).send(new Error(internal_error))
		}
		const { auth_salt: salt,
			auth_zkpp: zkpp,
			auth_public: client_public, 
			auth_private: server_private,
			is_verified,
			encrypted_question,
			encrypted_profile } = { ...account_query[0] }

		// handle unverified accounts
		if(!is_verified) {
			log.warn(`Account/Signin/Verify: Failure: ${email} Error: Account Unverified`)
			return reply.code(400).send(new Error(account_unverified))
		}

		// generate server proof / verify client proof
		let server_proof
		try {
			server_proof = await pake_server_derive_proof(server_private, client_public, salt, zkpp, email, client_proof)
		} catch(e) {
			log.warn(`Account/Signin/Verify: Failure: ${email} Error: Invalid Key`)
			return reply.code(400).send(new Error(invalid_key))
		}

		// delete auth keys
		await db('account').where({ email }).update({
			auth_public: '',
			auth_private: ''
		})

		// return server proof, encrypted question and encrypted profile
		log.info(`Account/Signin/Verify: Success: ${email}`)
		return reply.code(200).send({ server_proof, encrypted_question, encrypted_profile })

	// handle errors
	} catch(e) {
		log.error(`Account/Signin/Verify: Failure: ${email} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = sign_in_verify
