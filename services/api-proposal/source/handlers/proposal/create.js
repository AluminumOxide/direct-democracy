const api_membership_client = require('@aluminumoxide/direct-democracy-membership-api-client')

const proposal_create = async function(request, reply, db, log) {
	const { proposal_name, proposal_description, proposal_target, proposal_changes, democracy_id, membership_id } = request

	// check the membership_id & democracy_id are valid
	try {
		const mem_check = await api_membership_client.membership_read({ membership_id })
		if(mem_check.democracy_id !== democracy_id) {
			log.error('Proposal/Create: Failure(invalid democracy '+democracy_id+')')
			return reply.code(400).send()
		}
	} catch (e) {
		log.error('Proposal/Create: Failure(invalid membership '+membership_id+')')
		return reply.code(400).send()
	}

	// save the proposal
	let rows
	try {
		rows = await db('proposal')
		.insert({
			'democracy_id': democracy_id,
			'membership_id': membership_id,
			'name': proposal_name,
			'description': proposal_description,
			'target': proposal_target,
			'changes': proposal_changes
		})
		.returning('*')
	} catch (e) {
		log.error('Proposal/Create: Failure')
		return reply.code(400).send()
	}

	// return results
	if(!rows || rows.length < 1) {
		log.error('Proposal/Create: Failure')
		return reply.code(400).send()
  }
	const proposal = {
		proposal_id: rows[0].id,
		membership_id: rows[0].membership_id,
		proposal_name: rows[0].name,
		proposal_description: rows[0].description,
		proposal_target: rows[0].target,
		proposal_changes: rows[0].changes,
		proposal_votable: rows[0].votable,
		date_created: rows[0].date_created,
		date_updated: rows[0].date_updated
	}
	log.info('Proposal/Create: Success('+proposal.proposal_id+')')
	return reply.code(201).send(proposal)
}

module.exports = proposal_create
