const api_proposal_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
const api_democracy_client = require('@aluminumoxide/direct-democracy-democracy-api-client')

const ballot_create = async function(request, reply, db, log) {
	const { proposal_id, membership_id, is_approved, ballot_comments } = request

	// check the proposal_id is valid
	let prop_check
	try {
		prop_check = await api_proposal_client.proposal_read({ proposal_id })
	} catch (e) {
		log.error('Ballot/Create: Failure(invalid proposal '+proposal_id+')')
		return reply.code(400).send()
	}

  // check that proposal is votable
  if(!prop_check.proposal_votable) {
    log.error('Ballot/Update: Failure(voting closed '+proposal_id+')')
    return reply.code(400).send()
  }

	// check the membership_id & democracy_id are valid
	try {
		const mem_check = await api_democracy_client.membership_read({ democracy_id: prop_check.democracy_id, membership_id })
	} catch (e) {
		log.error('Ballot/Create: Failure(invalid membership_id '+membership_id+')')
		return reply.code(400).send()
	}

	// save the ballot
	let rows
	try {
		rows = await db('ballot')
		.insert({
			'proposal_id': proposal_id,
			'membership_id': membership_id,
			'is_approved': is_approved,
			'comments': ballot_comments
		})
		.returning('*')
	} catch (e) {
		log.error('Ballot/Create: Failure')
    return reply.code(400).send()
	}

	// return results
	if(!rows || rows.length < 1) {
		log.error('Ballot/Create: Failure')
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
	log.info('Ballot/Create: Success('+ballot.ballot_id+')')
	return reply.code(201).send(ballot)
}

module.exports = ballot_create
