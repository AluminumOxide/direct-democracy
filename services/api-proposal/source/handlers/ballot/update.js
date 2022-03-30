const api_proposal_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
const { proposal_dne, ballot_dne, membership_dne, ballot_closed, internal_error } =  require('../../errors.json')

const ballot_update = async function(request, reply, db, log) {
	const { ballot_id, proposal_id, membership_id, is_approved, ballot_comments } = request

	// check the proposal_id is valid
	let prop_check
	try {
		prop_check = await api_proposal_client.proposal_read({ proposal_id })
	} catch (e) {
		if(e.message === proposal_dne) {
			log.warn(`Ballot/Update: Failure: ${proposal_id} Error: Proposal does not exist`)
			return reply.code(400).send(new Error(proposal_dne))
		} else {
			log.error(`Ballot/Update: Failure: ${proposal_id} Error: Proposal read ${e}`)
			return reply.code(500).send(new Error(internal_error))
		}
	}

	// check that proposal is votable
	if(!prop_check.proposal_votable) {
		log.warn(`Ballot/Update: Failure: ${proposal_id} Error: Voting closed`)
		return reply.code(400).send(new Error(voting_closed))
	}

	// check the ballot_id is valid
	let bllt_check
	try {
		bllt_check = await api_proposal_client.ballot_read({ proposal_id, ballot_id })
	} catch (e) {
		if(e.message === ballot_dne) {
			log.warn(`Ballot/Update: Failure: ${ballot_id} Error: Ballot does not exist`)
			return reply.code(400).send(new Error(ballot_dne))
		} else {
			log.error(`Ballot/Update: Failure: ${ballot_id} Error: Ballot read ${e}`)
			return reply.code(500).send(new Error(internal_error))
		}
	}

	// check the ballot is modifiable
	if(!bllt_check.ballot_modifiable) {
		log.warn(`Ballot/Update: Failure: ${ballot_id} Error: Ballot closed`)
		return reply.code(400).send(new Error(ballot_closed))
	}

	// check membership_id and ballot_id match
	if(bllt_check.membership_id !== membership_id) {
		log.warn(`Ballot/Update: Failure: ${membership_id} Error: Membership does not exist`)
		return reply.code(400).send(new Error(membership_dne))
	}

	// update ballot
	let rows
	try {
		rows = await db('ballot')
		.update({
			is_approved: is_approved,
			comments: ballot_comments
		})
		.where({
			id: ballot_id,
			proposal_id: proposal_id,
			membership_id: membership_id
		})
		.returning('*')

		if(!rows || rows.length < 1) {
			log.error(`Ballot/Update: Failure: ${ballot_id} Error: Failed to update`)
			return reply.code(500).send(new Error(internal_error))
		}

	} catch (e) {
		log.error(`Ballot/Update: Failure: ${ballot_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	// return results
	const ballot = {
		'ballot_id': rows[0].id,
		'proposal_id': rows[0].proposal_id,
		'membership_id': rows[0].membership_id,
		'is_approved': rows[0].is_approved,
		'ballot_comments': rows[0].comments,
		'ballot_modifiable': rows[0].modifiable,
		'date_created': rows[0].date_created,
		'date_updated': rows[0].date_updated
	}
	log.info(`Ballot/Update: Success: ${ballot_id}`)
	return reply.code(200).send(ballot)
}

module.exports = ballot_update
