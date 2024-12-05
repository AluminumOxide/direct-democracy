const prop_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
const auth = require('../../helpers/auth')

const proposal_list = async function(request, reply, db, log) {
 	let { limit, last, sort, order, filter } = request

	try {
		// get profile_id and add to filter
		const profile_id = await auth.get_profile_id(request, log)
		if(!filter) {
			filter = {}
		}
		filter['profile_id'] = profile_id

		// fetch from proposal service
		const prop = await prop_client.proposal_list({ limit, last, sort, order, filter })

		// return results
		log.info(`Proposal/List: Success`)
		return reply.code(200).send(prop)

	} catch(e) {

		// handle errors
		log.error(`Proposal/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(prop_client.errors.internal_error))
	}
}

module.exports = proposal_list
