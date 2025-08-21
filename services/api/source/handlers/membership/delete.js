const { invalid_auth } = require('../../errors')

const membership_delete = async function(request, reply, db, log, lib) {

	const { membership_id, jwt } = request
	const { api_profile, api_membership } = lib

	try {
		// get profile_id
		const { profile_id } = await api_profile.sign_in_verify({ jwt })
		if(!profile_id) {
			// shouldn't happen
			log.error(`Membership/Delete: Failure: ${jwt} Error: JWT verify`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// fetch from membership service
		await api_membership.membership_delete({ membership_id, profile_id })

		// return results
		log.info(`Membership/Delete: Success: ${membership_id}`)
		return reply.code(201).send()

	} catch(e) {

		// handle invalid jwt
		if(e.message === api_profile.errors.invalid_auth) {
			log.warn(`Membership/Delete: Failure: ${jwt} Error: Invalid token`)
			return reply.code(401).send(new Error(invalid_auth))
		}

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
