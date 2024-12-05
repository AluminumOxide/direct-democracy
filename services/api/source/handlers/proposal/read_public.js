const prop_client = require('@aluminumoxide/direct-democracy-proposal-api-client')

const proposal_read = async function(request, reply, db, log) {
	const { democracy_id, proposal_id } = request

	try {
		// fetch from proposal service
		const prop = await prop_client.proposal_read({ proposal_id })

		// handle invalid democracy_id
		if(prop.democracy_id !== democracy_id) {
			log.warn(`Proposal/Read: Failure: ${proposal_id} Error: Invalid democracy_id`)
			return reply.code(400).send(new Error(prop_client.errors.democracy_invalid))
		}

		// return results
		log.info(`Proposal/Read: Success: ${proposal_id}`)
		return reply.code(200).send(prop)

	} catch(e) {

		// handle invalid proposal_id
		if(e.message === prop_client.errors.proposal_dne) {
			log.warn(`Proposal/Read: Failure: ${proposal_id} Error: Proposal does not exist`)
			return reply.code(400).send(new Error(prop_client.errors.proposal_dne))
		}

		// handle other errors
		log.error(`Proposal/Read: Failure: ${proposal_id} Error: ${e}`)
		return reply.code(500).send(new Error(prop_client.errors.internal_error))
	}
}

module.exports = proposal_read
