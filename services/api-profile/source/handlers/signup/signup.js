const { token_dne, id_dupe, internal_error } = require('../../errors.json')

const sign_up = async function(request, reply, db, log, lib) {

	const { profile_id, zkpp, salt, profile_token } = request

	try {
		// verify profile id is unique
		const unique_query = await db('profile').select('id').where({ id: profile_id })

		// handle duplicate profile id
		if(unique_query.length > 0) {
			log.warn(`Profile/Signup: Failure: ${profile_id} Error: Duplicate ID`)
			return reply.code(400).send(new Error(id_dupe))
		}

		// verify and delete profile token
		const delete_query = await db('token').where({ bucket: 'profile', token: profile_token }).del(['token'])

		// handle missing profile token
		if(!delete_query || delete_query.length < 1) {
			log.warn(`Profile/Signup: Failure: ${profile_token} Error: Token DNE`)
			return reply.code(400).send(new Error(token_dne))

		// handle duplicate profile token - should never happen
		} else if(delete_query.length > 1) {
			log.error(`Profile/Signup: Failure: ${profile_token} Error: Double Token!`)
			return reply.code(500).send(new Error(internal_error))
		}

		// pick a signup token
		const token_query = await db('token').where({
				bucket: 'signup'
			}).orderByRaw('random()').limit(1).del(['token'])

		// handle empty signup bucket
		if(!token_query || token_query.length < 1) {
			log.error(`Profile/Signup: Failure: ${profile_id} Error: No signup token!`)
			return reply.code(500).send(new Error(internal_error))
		}
		const signup_token = token_query[0].token

		// save new profile
		const rows = await db('profile').insert({
				id: profile_id,
				auth_zkpp: zkpp,
				auth_salt: salt
			}).returning('*')

		// handle account creation failure
		if(!rows || rows.length < 1) {
			log.error(`Profile/Signup: Failure: ${profile_id} Error: Profile insertion`)
			return reply.code(500).send(new Error(internal_error))
		}

		// return signup token
		log.info(`Profile/Signup: Success: ${profile_id}`)
		return reply.code(200).send({ token: signup_token })

	// handle errors
	} catch(e) {
		log.error(`Profile/Signup: Failure: ${profile_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = sign_up
