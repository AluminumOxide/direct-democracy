const { invalid_auth } = require('../../errors')

const membership_create = async function(request, reply, db, log, lib) {

	const { democracy_id, jwt } = request
	const { api_profile, api_membership } = lib

	try {
		// get auth info
		const { profile_id } = await api_profile.sign_in_verify({ jwt })
		if(!profile_id) {
			// shouldn't happen
			log.error(`Membership/Create: Failure: ${jwt} Error: JWT verify`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// fetch from membership service
		const mem = await api_membership.membership_create({ democracy_id, profile_id })

		// return results
		log.info(`Membership/Create: Success: ${mem.membership_id}`)
		return reply.code(200).send(mem)

	} catch(e) {

		// handle invalid jwt
		if(e.message === api_profile.errors.invalid_auth) {
			log.warn(`Membership/Create: Failure: ${jwt} Error: Invalid token`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// handle invalid democracy_id
		if(e.message === api_membership.errors.democracy_dne) {
			log.warn(`Membership/Create: Failure: ${democracy_id} Error: Invalid democracy_id`)
			return reply.code(400).send(new Error(api_membership.errors.democracy_dne))
		}

		// handle pre-existing membership
		if(e.message === api_membership.errors.membership_exist) {
			log.warn(`Membership/Create: Failure: ${democracy_id} Error: Membership already exists`)
			return reply.code(400).send(new Error(api_membership.errors.membership_exist))
		}

		// handle all other errors
		log.error(`Membership/Create: Failure: ${democracy_id} Error: ${e}`)
		return reply.code(500).send(new Error(api_membership.errors.internal_error))
	}
}

module.exports = membership_create
