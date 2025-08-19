
const proposal_list = async function(request, reply, db, log, lib) {

 	let { limit, last, sort, order, filter, democracy_id } = request
	const { api_proposal } = lib

	// construct filter
	if(!filter) {
		filter = {}
	}
	filter["democracy_id"] = { "op": "=", "val": democracy_id }

	// ignore any profile_id searches
	delete filter['profile_id']

	try {
		// fetch from proposal service
		const props = await api_proposal.proposal_list({ limit, last, sort, order, filter })

		// return results
		log.info(`Proposal/List: Success: ${democracy_id}`)
		return reply.code(200).send(props)

	} catch(e) {

		// handle errors
		log.error(`Proposal/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(api_proposal.errors.internal_error))
	}
}

module.exports = proposal_list
