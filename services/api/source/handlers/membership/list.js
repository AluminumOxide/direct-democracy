const { validate_jwt } = require('../../helpers/auth')

const membership_list = async function(request, reply, db, log, lib) {

	let { limit, last, sort, order, filter={}, jwt } = request
	const { api_membership } = lib

	try {
		// get profile_id
		const profile_id = await validate_jwt(jwt)

		// set up filter
		filter['profile_id'] = { op: '=', val: profile_id }

		// fetch from membership service
		const mems = await api_membership.membership_list({ limit, last, sort, order, filter })

		// return results
		log.info(`Membership/List: Success: ${profile_id}`)
		return reply.code(200).send(mems)

	} catch(e) {

		// handle all other errors
		log.error(`Membership/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(api_membership.errors.internal_error))
	}
}

module.exports = membership_list
