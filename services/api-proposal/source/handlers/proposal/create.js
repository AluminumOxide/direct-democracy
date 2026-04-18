const { democracy_dne, democracy_invalid, membership_dne, membership_unverified, changes_invalid, internal_error } = require('../../errors.json')

const proposal_create = async function(request, reply, db, log, lib) {

	const { proposal_name, proposal_description, proposal_target, proposal_changes, democracy_id, membership_id } = request
	const { api_membership, api_democracy, api_proposal, lib_json } = lib

	// check the membership_id is valid
	let mem_check
	try {
		mem_check = await api_membership.membership_read({ membership_id })
		if(mem_check.democracy_id !== democracy_id) {
			log.warn(`Proposal/Create: Failure: ${democracy_id} Error: Invalid democracy`)
			return reply.code(400).send(new Error(democracy_invalid))
		}
		if(!mem_check.is_verified && proposal_target !== 'democracy_members' && proposal_target !== 'democracy_misconduct') {
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

	// check the democracy_id is valid
	let democracy
	try {
		democracy = await api_democracy.democracy_read({ democracy_id })
		if(!!democracy.democracy_children) {
			let c = {}
			democracy.democracy_children.map(d => c[d.name] = d.id)
			democracy.democracy_children = c
		}
	} catch (e) {
		if(e.message === api_democracy.errors.democracy_dne) {
			log.warn(`Proposal/Create: Failure: ${democracy_id} Error: Democracy does not exist`)
			return reply.code(400).send(new Error(democracy_dne))
		}
		log.error(`Proposal/Create: Failure: ${democracy_id} Error: Failure fetching democracy - ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	// check the proposal is unique
	const prev = await db('proposal').select('*').where({
		democracy_id,
		target: proposal_target,
		changes: proposal_changes,
		votable: true
	})
	if(!!prev && prev.length > 0) {
		log.info(`Proposal/Create: Success: Already exists`)
		return reply.code(200).send({
			proposal_id: prev[0].id,
			democracy_id: prev[0].democracy_id,
			membership_id: prev[0].membership_id,
			proposal_name: prev[0].name,
			proposal_description: prev[0].description,
			proposal_target: prev[0].target,
			proposal_changes: prev[0].changes,
			proposal_votable: prev[0].votable,
			date_created: prev[0].date_created,
			date_updated: prev[0].date_updated
		})
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

		// check changes of report misconduct
		if(proposal_target === 'democracy_misconduct') {

			// get target type, text, ID and keys
			const t_type = !proposal_changes[proposal_name] ? false : Object.keys(proposal_changes[proposal_name])[0]
			const t_id = !t_type || !proposal_changes[proposal_name][t_type] ? false : Object.keys(proposal_changes[proposal_name][t_type])[0]
			const t_text = !t_id || !proposal_changes[proposal_name][t_type][t_id] || !proposal_changes[proposal_name][t_type][t_id]._add ? false : Object.keys(proposal_changes[proposal_name][t_type][t_id]._add)[0]
			const t_keys = !t_text || !proposal_changes[proposal_name][t_type][t_id]._add[t_text] ? [] : proposal_changes[proposal_name][t_type][t_id]._add[t_text]
			if(!t_text) {
				log.warn(`Proposal/Create: Failure: Invalid changes`)
				return reply.code(400).send(new Error(changes_invalid))
			}

			// check target type, text, ID and keys
			if(t_type === 'ballot' && t_text === 'comments') {
				const balls = await db('ballot').select('comments').where({ id: t_id })
				if(!balls || balls.length < 1) {
					log.warn(`Proposal/Create: Failure: Invalid changes`)
					return reply.code(400).send(new Error(changes_invalid))
				}
			} else if(t_type === 'proposal' && ['name','description','changes'].indexOf(t_text) >= 0) {
				const prop = await api_proposal.proposal_read({ proposal_id: t_id })
				if(!prop || (t_text === 'changes' && !lib_json.obj_get(prop.proposal_changes, t_keys))) {
					log.warn(`Proposal/Create: Failure: Invalid changes`)
					return reply.code(400).send(new Error(changes_invalid))
				}
			} else if(t_type === 'democracy' && ['name','description','conduct','content'].indexOf(t_text) >= 0) {
				const dem = await api_democracy.democracy_read({ democracy_id: t_id })
				if(!dem || (t_text === 'conduct' && !lib_json.obj_get(dem.democracy_conduct, t_keys)) 
				   || (t_text === 'content' && !lib_json.obj_get(dem.democracy_content, t_keys))) {
					log.warn(`Proposal/Create: Failure: Invalid changes`)
					return reply.code(400).send(new Error(changes_invalid))
				}
			} else {
				log.warn(`Proposal/Create: Failure: Invalid changes`)
				return reply.code(400).send(new Error(changes_invalid))
			}

			// check misconduct ID
			if(Object.keys(democracy.democracy_conduct).indexOf(proposal_name) < 0) {
				log.warn(`Proposal/Create: Failure: Invalid changes`)
				return reply.code(400).send(new Error(changes_invalid))
			}
			
			democracy.democracy_misconduct = { [proposal_name] : { [t_type] : { [t_id]: {} }}}
		}

		// check changes of create democracy
		if(proposal_target === 'democracy_children' && (!proposal_changes._add || !proposal_changes._add[proposal_name] || !proposal_changes._add[proposal_name].democracy_conduct || !proposal_changes._add[proposal_name].democracy_content || !proposal_changes._add[proposal_name].democracy_metas)) {
			log.warn(`Proposal/Create: Failure: ${membership_id} Invalid changes`)
			return reply.code(400).send(new Error(changes_invalid))
		}
		
		// check changes against democracy
		if(!lib_json.check_changes(proposal_changes, democracy[proposal_target])) {
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
