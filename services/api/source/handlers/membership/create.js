const { validate_jwt } = require('../../helpers/auth')

const membership_create = async function(request, reply, db, log, lib) {

	const { democracy_id, jwt } = request
	const { api_membership } = lib

	try {
		// get auth info
		const profile_id = await validate_jwt(jwt)

		// fetch from membership service
		const mem = await api_membership.membership_create({ democracy_id, profile_id })

		// return results
		log.info(`Membership/Create: Success: ${mem.membership_id}`)
		return reply.code(200).send(mem)

	} catch(e) {

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
