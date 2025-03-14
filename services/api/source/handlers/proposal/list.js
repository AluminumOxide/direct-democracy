const prop_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
const auth = require('../../helpers/auth')

const proposal_list = async function(request, reply, db, log) {
 	let { limit, last, sort, order, filter={} } = request

	try {
		// get democracy_ids and add to filter
		const profile_id = await auth.get_profile_id(request, log)
		const membership_ids = await auth.get_membership_ids(profile_id)
		const democracy_ids = membership_ids.map((x) => x.democracy_id)
		filter['democracy_id'] = { op: 'IN', val: democracy_ids }

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
