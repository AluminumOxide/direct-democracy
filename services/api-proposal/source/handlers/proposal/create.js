const { democracy_dne, democracy_invalid, membership_dne, membership_unverified, changes_invalid, internal_error } = require('../../errors.json')

const proposal_create = async function(request, reply, db, log, lib) {

	const { proposal_name, proposal_description, proposal_target, proposal_changes, democracy_id, membership_id } = request
	const { api_membership, api_democracy, lib_json } = lib

	// check the membership_id & democracy_id are valid
	let mem_check
	try {
		mem_check = await api_membership.membership_read({ membership_id })
		if(mem_check.democracy_id !== democracy_id) {
			log.warn(`Proposal/Create: Failure: ${democracy_id} Error: Invalid democracy`)
			return reply.code(400).send(new Error(democracy_invalid))
		}
		if(!mem_check.is_verified && proposal_target !== 'democracy_members') {
			log.warn(`Proposal/Create: Failure: ${membership_id} Error: Membership Unverified`)
			return reply.code(400).send(new Error(membership_unverified))
		}
	} catch (e) {
		if(e.message === api_membership.errors.membership_dne) {
			log.warn(`Proposal/Create: Failure: ${membership_id} Error: Membership does not exist`)
			return reply.code(400).send(new Error(membership_dne))
		}
		log.error(`Proposal/Create: Failure: ${membership_id} Error: Failure fetching membership - ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	// fetch democracy
	let democracy
	try {
		democracy = await api_democracy.democracy_read({ democracy_id })
		let c = {}
		democracy.democracy_children.map(d => c[d.name] = d.id)
		democracy.democracy_children = c
	} catch (e) {
		if(e.message === api_democracy.errors.democracy_dne) {
			log.warn(`Proposal/Create: Failure: ${democracy_id} Error: Democracy does not exist`)
			return reply.code(400).send(new Error(democracy_dne))
		}
		log.error(`Proposal/Create: Failure: ${democracy_id} Error: Failure fetching democracy - ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	// check the proposed changes are valid
	try {
		
		// check changes of membership verify
		if(proposal_target === 'democracy_members') {
			if(!!mem_check.is_verified || !proposal_changes[membership_id] || !proposal_changes[membership_id]._update || !proposal_changes[membership_id]._update.is_verified) {
				log.warn(`Proposal/Create: Failure: ${membership_id} Invalid changes`)
				return reply.code(400).send(new Error(changes_invalid))
			}
			democracy.democracy_members = { [membership_id]: { is_verified: false }}
		}

		// check changes against democracy
		if(!lib_json.check_changes(proposal_changes, democracy[proposal_target])) {
			log.warn(`Proposal/Create: Failure: ${membership_id} Invalid changes`)
			return reply.code(400).send(new Error(changes_invalid))
		}

		// check changes of create democracy
		if(proposal_target === 'democracy_children' && (!proposal_changes._add || !proposal_changes._add[proposal_name] || !proposal_changes._add[proposal_name].democracy_conduct || !proposal_changes._add[proposal_name].democracy_content || !proposal_changes._add[proposal_name].democracy_metas)) {
			log.warn(`Proposal/Create: Failure: ${membership_id} Invalid changes`)
			return reply.code(400).send(new Error(changes_invalid))
		}

	} catch(e) {
		log.warn(`Proposal/Create: Failure: ${membership_id} Invalid changes: ${e}`)
		return reply.code(400).send(new Error(changes_invalid))
	}

	let proposal
	try {
		// save the proposal
		const rows = await db('proposal')
		.insert({
			'democracy_id': democracy_id,
			'membership_id': membership_id,
			'name': proposal_name,
			'description': proposal_description,
			'target': proposal_target,
			'changes': proposal_changes
		})
		.returning('*')

		// handle database error
		if(!rows || rows.length < 1) {
			log.error(`Proposal/Create: Failure: ${democracy_id} Error: Failed to insert proposal`)
			return reply.code(500).send(new Error(internal_error))
		}
		
		proposal = {
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

	} catch (e) {
		log.error(`Proposal/Create: Failure: ${democracy_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}


	// set the membership to verifying for those proposals
	if(proposal_target === 'democracy_members') {
		try {
			await api_membership.membership_verifying({
				membership_id,
				proposal_id: proposal.proposal_id
			})
		} catch (e) {
			log.error(`Proposal/Create: Failure: ${proposal.proposal_id} Error: Proposal created but member ${membership_id} not verifying`)
			return reply.code(500).send(new Error(internal_error))
		}
	}

	// return results
	log.info(`Proposal/Create: Success: ${proposal.proposal_id}`)
	return reply.code(201).send(proposal)

}

module.exports = proposal_create
