const { profile_dne, internal_error } = require('../../errors.json')
const { pake_server_generate_keys } = require('@aluminumoxide/direct-democracy-lib-auth')

const sign_in_init = async function(request, reply, db, log) {

	const { profile_id, key: client_public } = request

	try {
		// lookup profile by profile_id
		const profile_query = await db('profile').select(['auth_salt','auth_zkpp']).where({ id: profile_id })

		// handle missing profile
		if(!profile_query || profile_query.length < 1) {
			log.warn(`Profile/Signin/Init: Failure: ${profile_id} Error: Profile DNE`)
			return reply.code(400).send(new Error(profile_dne))

		// handle duplicate profiles - should never happen
		} else if(profile_query.length > 1) {
			log.error(`Profile/Signin/Init: Failure: ${profile_id} Error: Double Profile!`)
			return reply.code(500).send(new Error(internal_error))
		}
		const { auth_salt: salt, auth_zkpp: zkpp } = { ...profile_query[0] }

		// generate server keys
		const { public: server_public, private: server_private } = await pake_server_generate_keys(zkpp)

		// save auth keys
		await db('profile').where({ id: profile_id }).update({
			auth_public: client_public,
			auth_private: server_private
		})

		// return salt and server public key
		log.info(`Profile/Signin/Init: Success: ${profile_id}`)
		return reply.code(200).send({ salt, key: server_public })

	// handle errors
	} catch(e) {
		log.error(`Profile/Signin/Init: Failure: ${profile_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = sign_in_init
