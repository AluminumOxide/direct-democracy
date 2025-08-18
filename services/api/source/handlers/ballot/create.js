const { invalid_auth, internal_error } = require('../../errors.json')

const ballot_create = async function(request, reply, db, log, lib) {

	const { proposal_id, ballot_approved, ballot_comments, jwt } = request
	const { api_proposal, api_membership, api_profile } = lib

	try {
		// validate jwt
		const { profile_id } = await api_profile.sign_in_verify({ jwt })
		if(!profile_id) {
			// shouldn't happen
			log.error(`Ballot/Create: Failure: ${jwt} Error: JWT verify`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// get proposal
		const proposal = await api_proposal.proposal_read({ proposal_id })

		// get membership
		const membership = await api_membership.membership_list({
			filter: {
				democracy_id: { op: '=', val: proposal.democracy_id },
				profile_id: { op: '=', val: profile_id }
			}
		})

		// check membership
		if(membership.length === 0) {
			log.warn(`Ballot/Create: Failure: Error: Invalid Auth`)
			return reply.code(401).send(new Error(invalid_auth))
		}
		if(membership.length > 1) {
			// shouldn't happen
			log.error(`Ballot/Create: Failure: Error: Duplicate Membership`)
			return reply.code(500).send(new Error(internal_error))
		}
		const membership_id = membership[0].membership_id

		// create ballot
		const ballot = await api_proposal.ballot_create({ proposal_id, membership_id, ballot_approved, ballot_comments })

		// return results
		log.info(`Ballot/Create: Success: ${proposal_id}`)
		return reply.code(201).send(ballot)

	} catch(e) {

		// handle invalid jwt
		if(e.message === api_profile.errors.invalid_auth) {
			log.warn(`Ballot/Create: Failure: ${jwt} Error: Invalid token`)
			return reply.code(401).send(new Error(invalid_auth))
		}

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
