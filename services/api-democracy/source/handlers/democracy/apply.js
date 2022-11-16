const json_changes = require('@aluminumoxide/direct-democracy-lib-json-changes')
const api_proposal_client = new (require('@aluminumoxide/direct-democracy-proposal-api-client'))()
const api_democracy_client = new (require('@aluminumoxide/direct-democracy-democracy-api-client'))()
const { democracy_dne, democracy_pop, algo_missing, internal_error } = require('../../errors.json')

// Response Codes:
// 	200 - Passed & successfully applied
// 	304 - Not passing yet, try again later
// 	400 - Problem with proposal, it's been closed
// 	500 - System error, try again later
const apply_proposal = async function(request, reply, db, log) {
	const { proposal_id } = request

	try {

		// grab the proposal
		let proposal
		try {
			proposal = await api_proposal_client.proposal_read({ proposal_id })
		} catch (e) {
			if(e.message === api_proposal_client.errors.proposal_dne) {
				log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal does not exist`)
				return reply.code(400).send(new Error(api_proposal_client.errors.proposal_dne))
			}
			log.error(`Proposal/Apply: Failure: ${proposal_id} Error: Internal error fetching proposal: ${e.message}`)
			return reply.code(500).send(new Error(internal_error))
		}

		// grab the democracy
		const democracy_id = proposal.democracy_id
		let democracy
		try {
			democracy = await api_democracy_client.democracy_read({ democracy_id })
		} catch(e) {
			if(e.message === democracy_dne) {
				log.warn(`Proposal/Apply: Failure: ${proposal_id},${democracy_id} Error: Democracy does not exist`)
				// close proposal and return applicable error
				return await close_proposal(reply, log, proposal_id, 400, false, democracy_dne)
			}
			log.error(`Proposal/Apply: Failure: ${proposal_id},${democracy_id} Error: Internal error fetching democracy`)
			return reply.code(500).send(new Error(internal_error))
		}

		// grab the root democracy
		let root
		try {
			root = await api_democracy_client.democracy_root()
		} catch (e) {
			// should never happen
			log.error(`Proposal/Apply: Failure: ${proposal_id},${democracy_id} Error: Root democracy doesn't exist?!?`)
			return reply.code(500).send(new Error(internal_error))
		}

		// proposal target
		const target = proposal.proposal_target
		if(!(['name','description','conduct','content','metas']).includes(target)) {
			log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal has invalid target`)
			// close proposal and return applicable error
			return await close_proposal(reply, log, proposal_id, 400, false, api_proposal_client.errors.target_invalid)
		}

		// proposal changes
		const changes = proposal.proposal_changes
		if(!changes || typeof(changes) !== "object" || Object.keys(changes).length === 0) {
			log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal has no changes`) 
			// close proposal and return applicable error
			return await close_proposal(reply, log, proposal_id, 400, false, api_proposal_client.errors.no_changes)
		}

		// targeted contents
		const contents = democracy['democracy_'+target]
		if(target === 'name' || target === 'description') {
			if(Object.keys(changes).toString() !== '_update' || Object.keys(changes['_update']).toString() !== target || typeof(changes['_update'][target]) != "string") {
				log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal changes are invalid for target`)
				// close proposal and return applicable error
				return await close_proposal(reply, log, proposal_id, 400, false, api_proposal_client.errors.changes_invalid)
			}
		} else if(!json_changes.check_changes(changes, contents)) {
			log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal changes do not map to democracy contents`)
			// close proposal and return applicable error
			return await close_proposal(reply, log, proposal_id, 400, false, api_proposal_client.errors.changes_invalid)
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

		// democracy population
		const population = democracy.democracy_population_verified
		if(population === 0) {
			// should never happen
			log.error(`Proposal/Apply: Failure: ${proposal_id},${democracy_id} Error: Population 0`)
			// close proposal and return applicable error
			return await close_proposal(reply, log, proposal_id, 400, false, democracy_pop)
		}

		// check all applicable democracy rules pass
		try {
			if(check_rules(get_rules(changes, rules, algos), votes_yes, votes_no, population)) {

				// apply changes
				let a = {}
				if(target === 'name' || target === 'description') {
					a[target] = changes['_update'][target]
				} else {
					a[target] = json_changes.apply_changes(changes, contents)
				}

				// save changes
				let rows = await db('democracy').update(a).where({ id: democracy_id }).returning('*')
				if(!rows || rows.length < 1) {
					log.error(`Proposal/Apply: Failure: ${proposal_id},${democracy_id} Error: Unable to update democracy`)
					return reply.code(500).send(new Error(internal_error))
				}

				// close proposal and return successfully applied
				log.info(`Proposal/Apply: Success: ${proposal_id} passed and applied!`)
				return await close_proposal(reply, log, proposal_id, 200, true, false)
			}

			// return successfully ran but did not pass
			log.info(`Proposal/Apply: Failure: ${proposal_id} has not passed yet`)
			return reply.code(304).send()

		} catch(e) {

			// handle invalid algo
			if(e.message ===  algo_missing) {
				log.error(`Proposal/Apply: Failure: ${proposal_id} Error: Missing algo`)
				return reply.code(500).send(new Error(algo_missing))

			// handle invalid changes
			} else if(e.message === api_proposal_client.errors.changes_invalid) {
				log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Invalid changes`)
				// close proposal and return applicable error
				return await close_proposal(reply, log, proposal_id, 400, false, api_proposal_client.errors.changes_invalid)
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
const close_proposal = async function(reply, log, proposal_id, code, passed, msg) {
	try {
		await api_proposal_client.proposal_close({ proposal_id, passed })
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
 * 		a: {
 * 			add: { approval_percent_minimum: 53 },
 * 			update: { approval_percent_minimum: 54 },
 * 			delete: { approval_percent_minimum: 55 }
 * 		} 
 * 	}
 * 	algos: { approval_percent_minimum: 'approved_votes > value' }
 * Output: [
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
const get_rules = function(changes, rules, algos) {
	let to_pass = []
	const lookup = { 'add': '_add', 'update': '_update', 'delete': '_delete' }
	for(const i in rules) {
		if(i in lookup && lookup[i] in changes) {
			for(const j in rules[i]) {
				if(!(j in algos)) {
					throw new Error(algo_missing)
				}
				a = {}
                        	a[ algos[j] ] = rules[i][j]
                        	to_pass.push(a)
			}	
		} else if(i in changes) {
	       		to_pass = to_pass.concat(get_rules(changes[i], rules[i], algos))
		}	
	}
	return to_pass 
}

/*
 * Check if provided rules have passed
 * Input:
 * 	rules: [{ 'approved_votes > value': 50 }, ...]
 * 	approved_votes: number
 * 	disapproved_votes: number
 * 	democracy_population: number
 * Output: boolean
 */
const check_rules = function(rules, approved_votes, disapproved_votes, democracy_population) {
	for(const i of rules) {
       		for(const src in i) {
       			if(!(eval_algo(src, parseInt(i[src]), parseInt(approved_votes), parseInt(disapproved_votes), parseInt(democracy_population)))) {
       				return false
       			}
       		}
	}
	return true
}

// yes... i like to live dangerously
const eval_algo = function(src, value, approved_votes, disapproved_votes, democracy_population) {
	return eval(src)
}

module.exports = apply_proposal
