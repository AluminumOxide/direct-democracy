const { account_dne, internal_error, account_unverified } = require('../../errors.json')

const sign_in_init = async function(request, reply, db, log, lib) {

	const { email, key: client_public } = request
	const { pake_server_generate_keys } = lib.lib_auth

	try {
		// lookup account by email
		const account_query = await db('account').select(['is_verified','auth_salt','auth_zkpp']).where({ email })

		// handle missing account
		if(!account_query || account_query.length < 1) {
			log.warn(`Account/Signin/Init: Failure: ${email} Error: Account DNE`)
			return reply.code(400).send(new Error(account_dne))

		// handle duplicate accounts - should never happen
		} else if(account_query.length > 1) {
			log.error(`Account/Signin/Init: Failure: ${email} Error: Double Account!`)
			return reply.code(500).send(new Error(internal_error))
		}
		const { auth_salt: salt, auth_zkpp: zkpp, is_verified } = { ...account_query[0] }

		// handle unverified account
		if(!is_verified) {
			log.warn(`Account/Signin/Init: Failure: ${email} Error: Account not verified`)
			return reply.code(400).send(new Error(account_unverified))
		}

		// generate server keys
		const { public: server_public, private: server_private } = await pake_server_generate_keys(zkpp)

		// save auth keys
		await db('account').where({ email }).update({
			auth_public: client_public,
			auth_private: server_private
		})

		// return salt and server public key
		log.info(`Account/Signin/Init: Success: ${email}`)
		return reply.code(200).send({ salt, key: server_public })

	// handle errors
	} catch(e) {
		log.error(`Account/Signin/Init: Failure: ${email} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = sign_in_init
