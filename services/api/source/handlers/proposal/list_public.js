const prop_client = require('@aluminumoxide/direct-democracy-proposal-api-client')

const proposal_list = async function(request, reply, db, log) {
 	let { limit, last, sort, order, filter, democracy_id } = request

	// construct filter
	if(!filter) {
		filter = {}
	}
	filter["democracy_id"] = { "op": "=", "val": democracy_id }

	// ignore any profile_id searches
	delete filter['profile_id']

	try {
		// fetch from proposal service
		const props = await prop_client.proposal_list({ limit, last, sort, order, filter })

		// return results
		log.info(`Proposal/List: Success: ${democracy_id}`)
		return reply.code(200).send(props)

	} catch(e) {

		// handle errors
		log.error(`Proposal/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(prop_client.errors.internal_error))
	}
}

module.exports = proposal_list
