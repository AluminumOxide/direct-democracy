const mem_client = new (require('@aluminumoxide/direct-democracy-membership-api-client'))()
const auth = require('../../helpers/auth')

const membership_create = async function(request, reply, db, log) {
	const { democracy_id } = request

	try {
		// get auth info
		const profile_id = await auth.get_profile_id(request, log)

		// fetch from membership service
		const mem = await mem_client.membership_create({ democracy_id, profile_id })

		// return results
		log.info(`Membership/Create: Success: ${mem.membership_id}`)
		return reply.code(200).send(mem)

	} catch(e) {

		// handle invalid democracy_id
		if(e.message === mem_client.errors.democracy_dne) {
			log.warn(`Membership/Create: Failure: ${democracy_id} Error: Invalid democracy_id`)
			return reply.code(400).send(new Error(mem_client.errors.democracy_dne))
		}

		// handle pre-existing membership
		if(e.message === mem_client.errors.membership_exist) {
			log.warn(`Membership/Create: Failure: ${democracy_id} Error: Membership already exists`)
			return reply.code(400).send(new Error(mem_client.errors.membership_exist))
		}

		// handle all other errors
		log.error(`Membership/Create: Failure: ${democracy_id} Error: ${e}`)
		return reply.code(500).send(new Error(mem_client.errors.internal_error))
	}
}

module.exports = membership_create
