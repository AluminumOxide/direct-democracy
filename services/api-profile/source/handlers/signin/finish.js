const { profile_dne, internal_error } = require('../../errors.json')

const sign_in_finish = async function(request, reply, db, log, lib) {

	const { profile_id, key: client_proof } = request
	const { token_random, pake_server_derive_proof } = lib.lib_auth

	try {
		// lookup profile by profile_id
		const profile_query = await db('profile').select(['auth_salt','auth_zkpp','auth_public','auth_private']).where({ id: profile_id })

		// handle missing profile
		if(!profile_query || profile_query.length < 1) {
			log.warn(`Profile/Signin/Finish: Failure: ${profile_id} Error: Profile DNE`)
			return reply.code(400).send(new Error(profile_dne))

		// handle duplicate profiles - should never happen
		} else if(profile_query.length > 1) {
			log.error(`Profile/Signin/Finish: Failure: ${profile_id} Error: Double Profile!`)
			return reply.code(500).send(new Error(internal_error))
		}
		const { auth_salt: salt,
			auth_zkpp: zkpp,
			auth_public: client_public, 
			auth_private: server_private } = { ...profile_query[0] }

		// generate server proof / verify client proof
		const server_proof = await pake_server_derive_proof(server_private, client_public, salt, zkpp, profile_id, client_proof)

		// generate auth token and expiry
		const auth_token = token_random()
		let auth_expiry = new Date()
		auth_expiry.setHours(auth_expiry.getHours() + 1)

		// delete auth keys and save new auth token and expiry
		await db('profile').where({ id: profile_id }).update({
			auth_public: '',
			auth_private: '',
			auth_token,
			auth_expiry
		})

		// sign jwt
		const jwt = await lib.jwt.sign({ profile_id, auth_token, auth_expiry })

		// return server proof and profile jwt
		log.info(`Profile/Signin/Finish: Success: ${profile_id}`)
		return reply.code(200).send({ proof: server_proof, jwt }) 
	
	// handle errors
	} catch(e) {
		log.error(`Profile/Signin/Finish: Failure: ${profile_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = sign_in_finish
