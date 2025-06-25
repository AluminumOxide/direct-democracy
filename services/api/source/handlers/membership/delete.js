const auth = require('../../helpers/auth')

const membership_delete = async function(request, reply, db, log, lib) {

	const { membership_id } = request
	const { api_membership } = lib

	try {
		// get profile_id
		const profile_id = await auth.get_profile_id(request, log)

		// fetch from membership service
		await api_membership.membership_delete({ membership_id, profile_id })

		// return results
		log.info(`Membership/Delete: Success: ${membership_id}`)
		return reply.code(201).send()

	} catch(e) {

		// handle invalid membership_id
		if(e.message === api_membership.errors.membership_dne) {
			log.warn(`Membership/Delete: Failure: ${membership_id} Error: Invalid membership_id`)
			return reply.code(400).send(new Error(api_membership.errors.membership_dne))
		}

		// handle all other errors
		log.error(`Membership/Delete: Failure: ${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(api_membership.errors.internal_error))
	}
}

module.exports = membership_delete
