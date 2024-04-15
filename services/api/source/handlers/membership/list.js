const mem_client = require('@AluminumOxide/direct-democracy-membership-api-client')
const auth = require('../../helpers/auth')

const membership_list = async function(request, reply, db, log) {
	let { limit, last, sort, order, filter } = request
	try {
		// get profile_id
		const profile_id = await auth.get_profile_id(request, log)

		// set up filter
		if(!filter) {
			filter = {}
		}
		filter['profile_id'] = { op: '=', val: profile_id }

		// fetch from membership service
		const mems = await mem_client.membership_list({ limit, last, sort, order, filter })

		// return results
		log.info(`Membership/List: Success: ${profile_id}`)
		return reply.code(200).send(mems)

	} catch(e) {

		// handle all other errors
		log.error(`Membership/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(mem_client.errors.internal_error))
	}
}

module.exports = membership_list
