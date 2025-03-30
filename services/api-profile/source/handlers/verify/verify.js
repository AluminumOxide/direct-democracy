const { internal_error, token_dne, profile_dne, token_expired } = require('../../errors.json')

const verify = async function(request, reply, db, log, lib) {

	const { jwt } = request

	try {
		// TODO: verify jwt
		const { profile_id, auth_token, auth_expiry } = jwt

		// handle expired token
		if(new Date() > new Date(auth_expiry)) {
			log.warn(`Profile/Verify: Failure: ${profile_id} Error: Token expired`)
			return reply.code(400).send(new Error(token_expired))
		}

		// lookup profile
		const check_query = await db('profile').where({
			id: profile_id
		}).select('auth_token', 'auth_expiry')

		// handle missing profile
		if(!check_query || check_query.length < 1) {
			log.warn(`Profile/Verify: Failure: ${profile_id} Error: Profile DNE`)
			return reply.code(400).send(new Error(profile_dne))

		// handle duplicate profiles - should never happen
		} else if(check_query.length > 1) {
			log.error(`Profile/Verify: Failure: ${profile_id} Error: Duplicate profiles!`)
			return reply.code(500).send(new Error(internal_error))
		}

		// verify auth token and expiry
		if(auth_token != check_query[0].auth_token || new Date(auth_expiry).valueOf() != new Date(check_query[0].auth_expiry).valueOf()) {
			log.warn(`Profile/Verify: Failure: ${profile_id} Error: Invalid auth token`)
			return reply.code(400).send(new Error(token_dne))
		}

		// return success
		log.info(`Profile/Verify: Success`)
		return reply.code(200).send(true)

	// handle errors
	} catch(e) {
		log.error(`Profile/Verify: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = verify
