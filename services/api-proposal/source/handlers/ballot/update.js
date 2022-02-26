const api_proposal_client = require('@aluminumoxide/direct-democracy-proposal-api-client')

const ballot_update = async function(request, reply, db, log) {
	const { ballot_id, proposal_id, membership_id, is_approved, ballot_comments } = request

	// check the proposal_id is valid
	let prop_check
	try {
		prop_check = await api_proposal_client.proposal_read({ proposal_id })
	} catch (e) {
		log.error('Ballot/Update: Failure(invalid proposal '+proposal_id+')')
		return reply.code(400).send()
	}

	// check that proposal is votable
	if(!prop_check.proposal_votable) {
		log.error('Ballot/Update: Failure(voting closed '+proposal_id+')')
		return reply.code(400).send()
	}

	// check the ballot_id is valid
	let bllt_check
	try {
		bllt_check = await api_proposal_client.ballot_read({ proposal_id, ballot_id })
	} catch (e) {
		log.error('Ballot/Update: Failure(invalid ballot '+ballot_id+')')
		return reply.code(400).send()
	}

	// check the ballot is modifiable
	if(!bllt_check.ballot_modifiable) {
		log.error('Ballot/Update: Failure(ballot closed '+ballot_id+')')
		return reply.code(400).send()
	}

	// check membership_id and ballot_id match
	if(bllt_check.membership_id !== membership_id) {
		log.error('Ballot/Update: Failure(invalid membership '+membership_id+')')
		return reply.code(400).send()
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
	} catch (e) {
		log.error('Ballot/Update: Failure('+ballot_id+')')
		return reply.code(400).send()
	}

	// return results
	if(!rows || rows.length < 1) {
		log.error('Ballot/Update: Failure('+ballot_id+')')
		return reply.code(400).send()
	}
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
	log.info('Ballot/Update: Success('+ballot_id+')')
	return reply.code(200).send(ballot)
}

module.exports = ballot_update
