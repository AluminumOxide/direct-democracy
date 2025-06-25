const auth = require('../../helpers/auth')
const { invalid_auth } = require('../../errors.json')

const ballot_create = async function(request, reply, db, log, lib) {

	const { proposal_id, ballot_approved, ballot_comments } = request
	const { api_proposal } = lib

	try {
		// get proposal
		const proposal = await api_proposal.proposal_read({ proposal_id })

		// get membership_id
		const profile_id = await auth.get_profile_id(request, log)
		const membership_id = await auth.get_membership_id(profile_id, proposal.democracy_id)

		// create ballot
		const ballot = await api_proposal.ballot_create({ proposal_id, membership_id, ballot_approved, ballot_comments })

		// return results
		log.info(`Ballot/Create: Success: ${proposal_id}`)
		return reply.code(201).send(ballot)

	} catch(e) {

		// handle invalid proposal_id
		if(e.message === api_proposal.errors.proposal_dne) {
			log.warn(`Ballot/Create: Failure: ${proposal_id} Error: Invalid proposal_id`)
			return reply.code(400).send(new Error(api_proposal.errors.proposal_dne))
		}

		// handle closed voting
		if(e.message === api_proposal.errors.voting_closed) {
			log.warn(`Ballot/Create: Failure: ${proposal_id} Error: Voting is closed`)
			return reply.code(400).send(new Error(api_proposal.errors.voting_closed))
		}

		// handle invalid membership
		if(e.message === api_proposal.errors.membership_dne) {
			log.warn(`Ballot/Create: Failure: ${proposal_id} Error: Invalid membership`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// handle all other errors
		log.error(`Ballot/Create: Failure: ${proposal_id} Error: ${e}`)
		return reply.code(500).send(new Error(api_proposal.errors.internal_error))
	}
}

module.exports = ballot_create
