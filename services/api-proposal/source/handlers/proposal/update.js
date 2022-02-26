const api_proposal_client = require('@aluminumoxide/direct-democracy-proposal-api-client')

const proposal_update = async function(request, reply, db, log) {
	const { proposal_id, membership_id, proposal_name, proposal_description, proposal_target, proposal_changes, democracy_id } = request

	// check proposal_id and democracy_id is valid
	let prop_check
	try {
		prop_check = await api_proposal_client.proposal_read({ democracy_id, proposal_id })
	} catch (e) {
		log.error('Proposal/Update: Failure(invalid democracy '+democracy_id+' for '+proposal_id+')')
		return reply.code(400).send()
	}

	// check membership_id matches
	if(prop_check.membership_id !== membership_id) {
		log.error('Proposal/Update: Failure(invalid membership '+membership_id+' for '+proposal_id+')')
		return reply.code(400).send()
	}

	// check that no votes have been cast
	const vote_check = await db('ballot').where({ proposal_id })
	if(!!vote_check && vote_check.length > 0) {
		log.error('Proposal/Update: Failure(ballots already cast for '+proposal_id+')')
		return reply.code(400).send()
	}

	// update proposal
	let rows
	try {
		rows = await db('proposal')
		.update({
			name: proposal_name,
			description: proposal_description,
			changes: proposal_changes,
			democracy_id: democracy_id, 
			target: proposal_target
		})
		.where({
			id: proposal_id
		}).returning('*')
	} catch (e) {
		log.error('Proposal/Update: Failure('+proposal_id+')')
		return reply.code(400).send()
	}

	// return results
	if(!rows || rows.length < 1) {
		log.error('Proposal/Update: Failure('+proposal_id+')')
		return reply.code(400).send()
	}
  const proposal = {
    proposal_id: rows[0].id,
		democracy_id: rows[0].democracy_id,
		membership_id: rows[0].membership_id,
    proposal_name: rows[0].name,
    proposal_description: rows[0].description,
    proposal_target: rows[0].target,
    proposal_changes: rows[0].changes,
		proposal_votable: rows[0].votable,
    date_created: rows[0].date_created,
    date_updated: rows[0].date_updated
  }
	log.info('Proposal/Update: Success('+proposal_id+')')
	return reply.code(200).send(proposal)
}

module.exports = proposal_update
