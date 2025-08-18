const { internal_error, invalid_auth } = require('../../errors.json')

const verify = async function(request, reply, db, log, lib) {

	const { jwt } = request

	try {
		// verify jwt
		const jwt_verified = await lib.jwt.verify(jwt)
		if(!jwt_verified) {
			log.warn(`Profile/Signout: Failure: Error: Invalid JWT`)
			return reply.code(401).send(new Error(invalid_auth))
		}
		const { profile_id, auth_token, auth_expiry } = jwt_verified

		// handle expired token
		if(new Date() > new Date(auth_expiry)) {
			log.warn(`Profile/Verify: Failure: ${profile_id} Error: Token expired`)
			return reply.code(400).send(new Error(invalid_auth))
		}

		// lookup profile
		const check_query = await db('profile').where({
			id: profile_id
		}).select('auth_token', 'auth_expiry')

		// handle missing profile
		if(!check_query || check_query.length < 1) {
			log.warn(`Profile/Verify: Failure: ${profile_id} Error: Profile DNE`)
			return reply.code(400).send(new Error(invalid_auth))

		// handle duplicate profiles - should never happen
		} else if(check_query.length > 1) {
			log.error(`Profile/Verify: Failure: ${profile_id} Error: Duplicate profiles!`)
			return reply.code(500).send(new Error(internal_error))
		}

		// verify auth token and expiry
		if(auth_token != check_query[0].auth_token || new Date(auth_expiry).valueOf() != new Date(check_query[0].auth_expiry).valueOf()) {
			log.warn(`Profile/Verify: Failure: ${profile_id} Error: Invalid auth token`)
			return reply.code(400).send(new Error(invalid_auth))
		}

		// return success
		log.info(`Profile/Verify: Success`)
		return reply.code(200).send({ profile_id })

	// handle errors
	} catch(e) {
		log.error(`Profile/Verify: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = verify
