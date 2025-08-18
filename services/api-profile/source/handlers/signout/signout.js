const { internal_error, token_dne, profile_dne } = require('../../errors.json')

const sign_out = async function(request, reply, db, log, lib) {

	const { jwt } = request

	try {
		// TODO: verify jwt
		const jwt_verified = await lib.jwt.verify(jwt)
		if(!jwt_verified) {
			log.warn(`Profile/Signout: Failure: Error: Invalid JWT`)
			return reply.code(401).send(new Error(token_dne))
		}
		const { profile_id, auth_token, auth_expiry } = jwt_verified

		// lookup profile
		const check_query = await db('profile').where({
			id: profile_id
		}).select('auth_token', 'auth_expiry')

		// handle missing profile
		if(!check_query || check_query.length < 1) {
			log.warn(`Profile/Signout: Failure: ${profile_id} Error: Profile DNE`)
			return reply.code(400).send(new Error(profile_dne))

		// handle duplicate profiles - should never happen
		} else if(check_query.length > 1) {
			log.error(`Profile/Signout: Failure: ${profile_id} Error: Duplicate profiles!`)
			return reply.code(500).send(new Error(internal_error))
		}

		// verify auth token
		if(auth_token != check_query[0].auth_token) {
			log.warn(`Profile/Signout: Failure: ${profile_id} Error: Invalid auth token`)
			return reply.code(400).send(new Error(token_dne))
		}

		// delete auth token and expiry
		await db('profile').update({
			auth_token: null,
			auth_expiry: null
		}).where({ id: profile_id })

		// return success
		log.info(`Profile/Signout: Success`)
		return reply.code(200).send()

	// handle errors
	} catch(e) {
		log.error(`Profile/Signout: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = sign_out
