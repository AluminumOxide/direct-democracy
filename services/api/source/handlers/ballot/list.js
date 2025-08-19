const { invalid_auth } = require('../../errors.json')

const ballot_list = async function(request, reply, db, log, lib) {

	let  { limit, last, sort, order, filter={}, democracy_id, proposal_id } = request
	const { api_proposal } = lib

	try {
		// handle attempts to glean ballots' profile_ids
		if(!!filter['profile_id']) {
			log.warn(`Ballot/List: Failure: ${filter['profile_id']} Error: Attempt to view ballot profile_id`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// handle attempts to glean ballots' membership_ids
		if(!!filter['membership_id']) {
			log.warn(`Ballot/List: Failure: ${filter['membership_id']} Error: Attempt to view ballot membership_id`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// fetch proposal
		const prop = await api_proposal.proposal_read({ proposal_id })

		// handle invalid democracy_id
		if(prop.democracy_id !== democracy_id) {
			log.warn(`Ballot/List: Failure: ${proposal_id} Error: Invalid democracy_id`)
			return reply.code(400).send(new Error(api_proposal.errors.democracy_invalid))
		}

		// fetch ballots
		const ballots = await api_proposal.ballot_list({ limit, last, sort, order, filter, proposal_id })

		// return results
		log.info(`Ballot/List: Success: ${proposal_id}`)
		return reply.code(200).send(ballots)

	} catch(e) {
		
		// handle invalid proposal_id
		if(e.message === api_proposal.errors.proposal_dne) {
			log.warn(`Ballot/List: Failure: ${proposal_id} Error: Invalid proposal_id`)
			return reply.code(400).send(new Error(api_proposal.errors.proposal_dne))
		}
		
		// handle all other errors
		log.error(`Ballot/List: Failure: ${proposal_id} Error: ${e}`)
		return reply.code(500).send(new Error(api_proposal.errors.internal_error))
	}
}

module.exports = ballot_list
