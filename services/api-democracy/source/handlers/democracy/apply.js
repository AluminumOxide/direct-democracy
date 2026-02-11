const { democracy_dne, democracy_pop, algo_missing, internal_error } = require('../../errors.json')
   
// Response Codes:
// 	200 - Passed & successfully applied
//	204 - Closers passed, proposal closed
// 	304 - Not passing yet, try again later
// 	400 - Problem with proposal, it's been closed
// 	500 - System error, try again later
const apply_proposal = async function(request, reply, db, log, lib) {

	const { proposal_id } = request
	const { lib_json, api_proposal, api_democracy, api_membership } = lib
		
	try {

		// grab the proposal
		let proposal
		try {
			proposal = await api_proposal.proposal_read({ proposal_id })
		} catch (e) {
			if(e.message === api_proposal.errors.proposal_dne) {
				log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal does not exist`)
				return reply.code(400).send(new Error(api_proposal.errors.proposal_dne))
			}
			log.error(`Proposal/Apply: Failure: ${proposal_id} Error: Internal error fetching proposal: ${e.message}`)
			return reply.code(500).send(new Error(internal_error))
		}

		// verify proposal is votable
		if(!proposal.proposal_votable) {
				log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal is not votable`)
				return reply.code(400).send(new Error(api_proposal.errors.voting_closed))
		}

		// grab the democracy
		const democracy_id = proposal.democracy_id
		let democracy
		try {
			democracy = await api_democracy.democracy_read({ democracy_id })
			let c = {}
			democracy.democracy_children.map(d => c[d.name] = d.id)
			democracy.democracy_children = c
		} catch(e) {
			if(e.message === democracy_dne) {
				log.warn(`Proposal/Apply: Failure: ${proposal_id},${democracy_id} Error: Democracy does not exist`)
				// close proposal and return applicable error
				return await close_proposal(api_proposal, reply, log, proposal_id, 400, false, democracy_dne)
			}
			log.error(`Proposal/Apply: Failure: ${proposal_id},${democracy_id} Error: Internal error fetching democracy`)
			return reply.code(500).send(new Error(internal_error))
		}

		// grab the root democracy
		let root
		try {
			root = await api_democracy.democracy_root()
		} catch (e) {
			// should never happen
			log.error(`Proposal/Apply: Failure: ${proposal_id},${democracy_id} Error: Root democracy doesn't exist?!?`)
			return reply.code(500).send(new Error(internal_error))
		}

		// proposal target
		const target = proposal.proposal_target
		if(!(['democracy_name','democracy_description','democracy_conduct','democracy_content','democracy_metas','democracy_children','democracy_members','democracy_misconduct']).includes(target)) {
			log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal has invalid target`)
			// close proposal and return applicable error
			return await close_proposal(api_proposal, reply, log, proposal_id, 400, false, api_proposal.errors.target_invalid)
		}

		// get democracy members if needed
		if(target === 'democracy_members') {
			if(!proposal.proposal_changes[proposal.membership_id] || !proposal.proposal_changes[proposal.membership_id]._update || !proposal.proposal_changes[proposal.membership_id]._update.is_verified) {
				// shouldn't happen
				log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal has invalid membership verification`)
				return await close_proposal(api_proposal, reply, log, proposal_id, 400, false, api_proposal.errors.changes_invalid)
			}
			democracy.democracy_members = {[proposal.membership_id]:{is_verified: false}}
		}

		// get democracy misconduct if needed
		if(target === 'democracy_misconduct') {
			const t_type = !proposal.proposal_changes[proposal.proposal_name] ? false : Object.keys(proposal.proposal_changes[proposal.proposal_name])[0]
			const t_id = !t_type || !proposal.proposal_changes[proposal.proposal_name][t_type] ? false : Object.keys(proposal.proposal_changes[proposal.proposal_name][t_type])[0]
			const t_text = !t_id || !proposal.proposal_changes[proposal.proposal_name][t_type][t_id] || !proposal.proposal_changes[proposal.proposal_name][t_type][t_id]._add ? false : Object.keys(proposal.proposal_changes[proposal.proposal_name][t_type][t_id]._add)[0]
			if((['democracy','proposal','ballot'].indexOf(t_type) === -1) ||
				(t_type === 'democracy' && ['name','description','conduct','content'].indexOf(t_text) === -1) ||
				(t_type === 'proposal' && ['name','description','changes'].indexOf(t_text) === -1)) {
				// shouldn't happen
			        log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal has invalid misconduct report`)
			        return await close_proposal(api_proposal, reply, log, proposal_id, 400, false, api_proposal.errors.changes_invalid)
			}
			democracy.democracy_misconduct = { [proposal.proposal_name] : { [t_type] : { [t_id]: {} }}}
		}

		// proposal changes
		const changes = proposal.proposal_changes
		if(!changes || typeof(changes) !== "object" || Object.keys(changes).length === 0) {
			log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal has no changes`) 
			// close proposal and return applicable error
			return await close_proposal(api_proposal, reply, log, proposal_id, 400, false, api_proposal.errors.changes_dne)
		}

		// targeted contents
		const contents = democracy[target]
		if(!lib_json.check_changes(changes, contents)) {
			log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal changes do not map to democracy contents`)
			// close proposal and return applicable error
			return await close_proposal(api_proposal, reply, log, proposal_id, 400, false, api_proposal.errors.changes_invalid)
		}
		
		// democracy rules for proposal target
		let rules = democracy.democracy_metas[target]
		if(!rules || typeof(rules) !== "object" || Object.keys(rules).length === 0) {
			rules = {}
		}

		// algos to evaluate
		const algos = root.democracy_content.algos
		if(!algos || typeof(algos) !== "object" || Object.keys(algos).length === 0) {
			// should never happen
			log.error(`Proposal/Apply: Failure: ${proposal_id} Error: There are no algos?!?`)
			return reply.code(500).send(new Error(internal_error))
		}

		// proposal votes
		if(!proposal.proposal_votes || !proposal.proposal_votes.verified || typeof(proposal.proposal_votes.verified.yes) !== "number" || typeof(proposal.proposal_votes.verified.no) !== "number") {
			// should never happen
			log.error(`Proposal/Apply: Failure: ${proposal_id} Error: Invalid proposal vote counts`)
			return reply.code(500).send(new Error(internal_error))
		}
		const votes_yes = proposal.proposal_votes.verified.yes
		const votes_no = proposal.proposal_votes.verified.no

		// proposal creation date
		if(!proposal.date_created || !(new Date(proposal.date_created))) {
			// should never happen
			log.error(`Proposal/Apply: Failure: ${proposal_id} Error: Invalid proposal creation date`)
			return reply.code(500).send(new Error(internal_error))
		}
		const proposal_days = Math.ceil(((new Date()).getTime() - (new Date(proposal.date_created)).getTime()) / 86400000)

		// democracy population
		const population = democracy.democracy_population_verified
		if(population === 0) {
			// should never happen
			log.error(`Proposal/Apply: Failure: ${proposal_id},${democracy_id} Error: Population 0`)
			// close proposal and return applicable error
			return await close_proposal(api_proposal, reply, log, proposal_id, 400, false, democracy_pop)
		}

		try {
			// get closing rules
			const close_rules = get_rules(changes, rules, algos, true)

			// check if any closers pass
			if(check_rules(close_rules, true, votes_yes, votes_no, population, proposal_days)) {
				
				// close proposal and return that closers passed
				log.info(`Proposal/Apply: Failure: ${proposal_id} Closing conditions passed`)
				return await close_proposal(api_proposal, reply, log, proposal_id, 204, false, false)
			}
			
			// get modification rules
			const mod_rules = get_rules(changes, rules, algos, false)
			if(Object.keys(mod_rules).length === 0) {
				log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: No rules`)
				return await close_proposal(api_proposal, reply, log, proposal_id, 400, false, api_proposal.errors.changes_invalid)
			}

			// check all applicable democracy rules pass
			if(check_rules(mod_rules, false, votes_yes, votes_no, population, proposal_days)) {

				// apply changes

				// handle new democracy proposal
				if(target === 'democracy_children') {
					const democracy_name = proposal.proposal_name
					const democracy_description = proposal.proposal_description

					// check new democracy is valid
					if(!changes._add || !changes._add[democracy_name] || !changes._add[democracy_name].democracy_conduct || !changes._add[democracy_name].democracy_content || !changes._add[democracy_name].democracy_metas) {
						log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal changes are invalid`)
						// close proposal and return applicable error
						return await close_proposal(api_proposal, reply, log, proposal_id, 400, false, api_proposal.errors.changes_invalid)
						
					}

					// insert new democracy
					const democracy_conduct = changes._add[democracy_name].democracy_conduct
					const democracy_content = changes._add[democracy_name].democracy_content
					const democracy_metas = changes._add[democracy_name].democracy_metas
					const rows = await db('democracy').insert({
						parent_id: democracy_id,
						democracy_name,
						democracy_description,
						democracy_conduct,
						democracy_content,
						democracy_metas
					}).returning('*')
					
					// handle database errors
					if(!rows || rows.length < 1) {
						log.error(`Proposal/Apply: Failure: ${proposal_id},${democracy_id} Error: Unable to update democracy`)
						return reply.code(500).send(new Error(internal_error))
					}

					// collect a list of approvers
					const members = await api_proposal.ballot_list({
						proposal_id,
						filter: {
							ballot_approved: {
								op:'=',
								val: true
							}
						}
					})

					// create memberships for approvers
					await api_membership.democracy_members({
						democracy_id: rows[0].id,
						members: members.map(m => m.membership_id)
					})
			
				// handle membership verification
				} else if(target === 'democracy_members') {
					try {
						await api_membership.membership_verify({
							membership_id: proposal.membership_id
						})
					} catch(e) {
						log.error(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal approved but membership failed to verify`)
						return reply.code(500).send(new Error(internal_error))
					}

				// handle misconduct reports
				} else if(target === 'democracy_misconduct') {

					// get misconduct info
					const t_type = Object.keys(changes[proposal.proposal_name])[0]
					const t_id = Object.keys(changes[proposal.proposal_name][t_type])[0]
					const t_text = Object.keys(changes[proposal.proposal_name][t_type][t_id]._add)[0]
					const t_keys = changes[proposal.proposal_name][t_type][t_id]._add[t_text]
					const mis = democracy.democracy_conduct[proposal.proposal_name]
					let t_member
					let t_obj
					
					// determine if someone goes in timeout
					if(t_type !== 'democracy') {

						// figure out who to put in timeout
						if(t_type === 'ballot') {
							t_obj = await api_proposal.ballot_read({ ballot_id: t_id })
							t_member = t_obj.membership_id
						} else if(t_type === 'proposal') {
							t_obj = await api_proposal.proposal_read({ proposal_id: t_id })
							t_member = t_obj.membership_id
						}
						t_member = await api_membership.membership_read({ membership_id: t_member })

						// figure out how long to put them in timeout
						const timeout_count = t_member.timeout_count+1
						const timeout_count_multi = !mis.timeout_count_multi ? 1 : mis.timeout_count_multi
						const timeout_total = t_member.timeout_total
						const timeout_total_multi = !mis.timeout_total_multi ? 1 : mis.timeout_total_multi
						const timeout_base = !mis.timeout_base ? 0 : mis.timeout_base
						let timeout_days = timeout_count_multi*timeout_count+timeout_total_multi*timeout_total+timeout_base
						if(!!mis.timeout_min && timeout_days < mis.timeout_min) {
							timeout_days = mis.timeout_min
						}
						if(!!mis.timeout_max && timeout_days > mis.timeout_max) {
							timeout_days = mis.timeout_max
						}

						// put them in timeout
						await api_membership.membership_timeout({
							membership_id: t_member.membership_id,
							timeout_days,
							proposal_id
						})
					}
					
					// erase target content
					if(t_type === 'ballot') {
						await api_proposal.ballot_erase({
							ballot_id: t_id
						})
					} else if(t_type === 'proposal') {
						if(t_obj.proposal_votable) {
							await api_proposal.proposal_close({
								proposal_id: t_id,
								passed: false 
							})
						}
						await api_proposal.proposal_erase({
							proposal_id: t_id,
							erase_field: t_text,
							erase_keys: t_keys
						})
					} else if(t_type === 'democracy') {
						await api_democracy.democracy_erase({
							democracy_id: t_id,
							erase_field: t_text,
							erase_keys: t_keys
						})
					}

				// handle all other proposals
				} else {
					let a = {}
					a[target] = lib_json.apply_changes(changes, contents)

					// save changes
					const rows = await db('democracy').update(a).where({ id: democracy_id }).returning('*')
					// handle database errors
					if(!rows || rows.length < 1) {
						log.error(`Proposal/Apply: Failure: ${proposal_id},${democracy_id} Error: Unable to update democracy`)
						return reply.code(500).send(new Error(internal_error))
					}
				}

				// close proposal and return successfully applied
				log.info(`Proposal/Apply: Success: ${proposal_id} passed and applied!`)
				return await close_proposal(api_proposal, reply, log, proposal_id, 200, true, false)
			}

			// return successfully ran but did not pass or close
			log.info(`Proposal/Apply: Failure: ${proposal_id} has not passed yet`)
			return reply.code(304).send()

		} catch(e) {
			// handle invalid algo
			if(e.message ===  algo_missing) {
				log.error(`Proposal/Apply: Failure: ${proposal_id} Error: Missing algo`)
				return reply.code(500).send(new Error(algo_missing))

			// handle invalid changes
			} else if(e.message === api_proposal.errors.changes_invalid) {
				log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Invalid changes`)
				// close proposal and return applicable error
				return await close_proposal(api_proposal, reply, log, proposal_id, 400, false, api_proposal.errors.changes_invalid)
			}

			// handle all other errors
			log.error(`Proposal/Apply: Failure: ${proposal_id} Error: ${e.message}`)
			return reply.code(500).send(new Error(internal_error))
		}

	// handle all other errors
	} catch(e) {
		log.error(`Proposal/Apply: Failure: ${proposal_id} Error: ${e.message}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

/*** Helpers ***/

// close proposal
const close_proposal = async function(api_proposal, reply, log, proposal_id, code, passed, msg) {
	try {
		await api_proposal.proposal_close({ proposal_id, passed })
	} catch(e) {
		log.error(`Proposal/Apply: Failure: ${proposal_id} Error: Unable to close proposal: ${e.message}`)
		return reply.code(500).send(new Error(internal_error))
	}
	log.info(`Proposal/Apply: Success: ${proposal_id} Proposal closed`)
	return reply.code(code).send(msg ? new Error(msg) : '')
}


/*
 * Get algo source and values for given changes and rules
 * Input:
 * 	changes: { a: { _add: { b: 1 }, _update: { c: 2}, _delete: ['d'] }, _add: { e: 3 }, _update: { f: 4 }, _delete: ['g'] }
 * 	rules: { 
 * 		add: { approval_percent_minimum: 50 },
 * 		update: { approval_percent_minimum: 51 },
 * 		delete: { approval_percent_minimum: 52 },
 * 		close: { lifetime_maximum_days: 14 },
 * 		a: {
 * 			add: { approval_percent_minimum: 53 },
 * 			update: { approval_percent_minimum: 54 },
 * 			delete: { approval_percent_minimum: 55 },
 * 		} 
 * 	}
 * 	algos: { 
 * 		approval_percent_minimum: 'approved_votes > value' 
 * 		lifetime_maximum_days: 'proposal_days <= value'
 * 	}
 * 	close: boolean
 * Output: 
 * 	if close is true: [
 * 		{ 'proposal_days <= value': 14 }
 * 	]
 * 	if close is false: [
 * 		{ 'approved_votes > value': 50 },
 * 		{ 'approved_votes > value': 51 },
 * 		{ 'approved_votes > value': 52 },
 * 		{ 'approved_votes > value': 53 },
 * 		{ 'approved_votes > value': 54 },
 * 		{ 'approved_votes > value': 55 }
 * 	]
 * Error:
 *	algo_missing: algo in rules missing from algos
 */
const get_rules = function(changes, rules, algos, close, defaults={}) {
	let to_check = []
	let lookup = { 'add': '_add', 'update': '_update', 'delete': '_delete', 'close': '_close' }

	if(typeof changes !== "object") {
		return !close || !defaults.close ? [] : Object.entries(defaults.close).map(e => ({[e[0]]:e[1]}))
	}

	// update defaults for lookups
	for(const i in rules) {
		if(i in lookup) {
			defaults[i] = {}
			for(const j in rules[i]) {
				if(!(j in lookup)) {
					if(!(j in algos)) {
						throw new Error(algo_missing)
					}
                        		defaults[i][algos[j]] = rules[i][j]
				}
			}
		}
	}
	
	// go through changes
	for(const i in changes) {

		// handle add/update/delete lookups
		if(!close && Object.values(lookup).indexOf(i) >= 0) {
			const j = Object.entries(lookup).find((e) => e[1] == i)[0]
			if(j in defaults) {
				to_check.push(defaults[j])
			}

		// recursively handle non-lookups
		} else if(i in rules) {
	       		to_check = to_check.concat(get_rules(changes[i], rules[i], algos, close, defaults))
		} else {
	       		to_check = to_check.concat(get_rules(changes[i], rules, algos, close, defaults))
		}
	}
	return to_check 
}

/*
 * Check if provided rules have passed
 * Input:
 * 	rules: [{ 'approved_votes > value': 50 }, ...]
 * 	approved_votes: number
 * 	disapproved_votes: number
 * 	democracy_population: number
 * 	proposal_days: number
 * Output: boolean
 */
const check_rules = function(rules, close, approved_votes, disapproved_votes, democracy_population, proposal_days) {
	for(const i of rules) {
       		for(const src in i) {
       			if(!(eval_algo(src, parseInt(i[src]), parseInt(approved_votes), parseInt(disapproved_votes), parseInt(democracy_population), proposal_days))) {
				return close ? true : false
       			}
       		}
	}
	return close ? false : true
}


// yes... i like to live dangerously
const eval_algo = function(src, value, approved_votes, disapproved_votes, democracy_population, proposal_days) {
	return eval(src)
}

module.exports = apply_proposal
