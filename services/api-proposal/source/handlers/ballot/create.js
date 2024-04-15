const api_proposal_client = require('@AluminumOxide/direct-democracy-proposal-api-client')
const api_membership_client = require('@AluminumOxide/direct-democracy-membership-api-client')
const { voting_closed, proposal_dne, membership_dne, internal_error } = require('../../errors.json')

const ballot_create = async function(request, reply, db, log) {
	const { proposal_id, membership_id, ballot_approved, ballot_comments } = request

	// check the proposal_id is valid
	let prop_check
	try {
		prop_check = await api_proposal_client.proposal_read({ proposal_id })

	} catch (e) {
		if(e.message === proposal_dne) {
			log.warn(`Ballot/Create: Failure: ${proposal_id} Error: Proposal does not exist`)
			return reply.code(400).send(new Error(proposal_dne))
		} else {
			log.error(`Ballot/Create: Failure: ${proposal_id} Error: Proposal read ${e}`)
			return reply.code(500).send(new Error(internal_error))
		}
	}

	// check that proposal is votable
	if(!prop_check.proposal_votable) {
		log.warn(`Ballot/Create: Failure: ${proposal_id} Error: Voting closed`)
		return reply.code(400).send(new Error(voting_closed))
	}

	// check the membership_id & democracy_id are valid
	let membership
	try {
		membership = await api_membership_client.membership_read({ membership_id })
	} catch (e) {
		if(e.message === membership_dne) {
			log.warn(`Ballot/Create: Failure: ${membership_id} Error: Membership does not exist`)
			return reply.code(400).send(new Error(membership_dne))
		} else {
			log.error(`Ballot/Create: Failure: ${membership_id} Error: Membership read ${e}`)
			return reply.code(500).send(new Error(internal_error))
		}
	}

	// save the ballot
	let rows
	try {
		rows = await db('ballot')
		.insert({
			'proposal_id': proposal_id,
			'membership_id': membership_id,
			'is_approved': ballot_approved,
			'is_verified': membership.is_verified,
			'comments': ballot_comments
		})
		.returning('*')

		if(!rows || rows.length < 1) {
			log.error(`Ballot/Create: Failure: ${proposal_id},${membership_id} Error: Failed to insert ballot`)
			return reply.code(500).send(new Error(internal_error))
		}

	} catch (e) {
		log.error(`Ballot/Create: Failure: ${proposal_id},${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	// return results
	const ballot = {
		'ballot_id': rows[0].id,
		'proposal_id': rows[0].proposal_id,
		'membership_id': rows[0].membership_id,
		'ballot_approved': rows[0].is_approved,
		'ballot_comments': rows[0].comments,
		'ballot_modifiable': rows[0].modifiable,
		'date_created': rows[0].date_created,
		'date_updated': rows[0].date_updated
	}
	log.info(`Ballot/Create: Success: ${ballot.ballot_id}`)
	return reply.code(201).send(ballot)
}

module.exports = ballot_create
