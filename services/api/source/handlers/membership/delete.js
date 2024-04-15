const mem_client = require('@AluminumOxide/direct-democracy-membership-api-client')
const auth = require('../../helpers/auth')

const membership_delete = async function(request, reply, db, log) {
	const { membership_id } = request

	try {
		// get profile_id
		const profile_id = await auth.get_profile_id(request, log)

		// fetch from membership service
		await mem_client.membership_delete({ membership_id, profile_id })

		// return results
		log.info(`Membership/Delete: Success: ${membership_id}`)
		return reply.code(201).send()

	} catch(e) {

		// handle invalid membership_id
		if(e.message === mem_client.errors.membership_dne) {
			log.warn(`Membership/Delete: Failure: ${membership_id} Error: Invalid membership_id`)
			return reply.code(400).send(new Error(mem_client.errors.membership_dne))
		}

		// handle all other errors
		log.error(`Membership/Delete: Failure: ${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(mem_client.errors.internal_error))
	}
}

module.exports = membership_delete
