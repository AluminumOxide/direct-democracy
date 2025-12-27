
const proposal_read = async function(request, reply, db, log, lib) {

	const { proposal_id } = request
	const { api_proposal, api_democracy } = lib

	try {
		// fetch from proposal service
		let prop = await api_proposal.proposal_read({ proposal_id })

		// fetch the democracy name
		const dem = await api_democracy.democracy_read({ democracy_id: prop.democracy_id })
		// update proposal democracy name
		prop.democracy_id = {id: dem.democracy_id, name: dem.democracy_name}

		// return results
		log.info(`Proposal/Read: Success: ${proposal_id}`)
		return reply.code(200).send(prop)

	} catch(e) {

		// handle invalid proposal_id
		if(e.message === api_proposal.errors.proposal_dne) {
			log.warn(`Proposal/Read: Failure: ${proposal_id} Error: Proposal does not exist`)
			return reply.code(400).send(new Error(api_proposal.errors.proposal_dne))
		}

		// handle other errors
		log.error(`Proposal/Read: Failure: ${proposal_id} Error: ${e}`)
		return reply.code(500).send(new Error(api_proposal.errors.internal_error))
	}
}

module.exports = proposal_read
