const prop_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
const auth = require('../../helpers/auth')
const { invalid_auth } = require('../../errors.json')

const ballot_update = async function(request, reply, db, log) {
	const { ballot_id, ballot_approved, ballot_comments } = request

	try {
		// get ballot
		const ballot = await prop_client.ballot_read({ ballot_id })

		// get membership ids
		const profile_id = await auth.get_profile_id(request, log)
		const memberships = await auth.get_membership_ids(profile_id)
		const membership_ids = memberships.map((x) => x.membership_id)
		
		// check membership id
		if(membership_ids.indexOf(ballot.membership_id) < 0) {
			log.warn(`Ballot/Update: Failure: Error: Invalid Auth`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// update ballot
		const new_ballot = await prop_client.ballot_update({ 
			ballot_id,
			membership_id: ballot.membership_id,
			proposal_id: ballot.proposal_id,
			ballot_approved,
			ballot_comments
		})

		// return results
		log.info(`Ballot/Update: Success: `)
		return reply.code(200).send(new_ballot)

	} catch(e) {

		// handle invalid ballot_id
		if(e.message === prop_client.errors.ballot_dne) {
			log.warn(`Ballot/Update: Failure:  Error: Invalid ballot_id`)
			return reply.code(400).send(new Error(prop_client.errors.ballot_dne))
		}

		// handle invalid membership_id
		if(e.message === prop_client.errors.membership_dne) {
			log.warn(`Ballot/Update: Failure:  Error: Invalid membership_id`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// handle invalid proposal
		if(e.message === prop_client.errors.proposal_dne) {
			log.warn(`Ballot/Update: Failure:  Error: Invalid proposal`)
			return reply.code(400).send(new Error(prop_client.errors.proposal_dne))
		}

		// handle closed voting
		if(e.message === prop_client.errors.voting_closed) {
			log.warn(`Ballot/Update: Failure:  Error: Voting closed`)
			return reply.code(400).send(new Error(prop_client.errors.voting_closed))
		}

		// handle closed ballot
		if(e.message === prop_client.errors.ballot_closed) {
			log.warn(`Ballot/Update: Failure:  Error: Ballot closed`)
			return reply.code(400).send(new Error(prop_client.errors.ballot_closed))
		}

		// handle all other errors
		log.error(`Ballot/Update: Failure:  Error: ${e}`)
		return reply.code(500).send(new Error(prop_client.errors.internal_error))
	}
}

module.exports = ballot_update
