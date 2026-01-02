const { democracy_dne, democracy_pop, algo_missing, internal_error } = require('../../errors.json')
   
// Response Codes:
// 	200 - Passed & successfully applied
//	204 - Closers passed, proposal closed
// 	304 - Not passing yet, try again later
// 	400 - Problem with proposal, it's been closed
// 	500 - System error, try again later
const apply_proposal = async function(request, reply, db, log, lib) {

	const { proposal_id } = request
	const { lib_json, api_proposal, api_democracy } = lib
		
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
		if(!(['democracy_name','democracy_description','democracy_conduct','democracy_content','democracy_metas']).includes(target)) {
			log.warn(`Proposal/Apply: Failure: ${proposal_id} Error: Proposal has invalid target`)
			// close proposal and return applicable error
			return await close_proposal(api_proposal, reply, log, proposal_id, 400, false, api_proposal.errors.target_invalid)
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
			// check if any closers pass
			if(check_rules(get_rules(changes, rules, algos, true), true, votes_yes, votes_no, population, proposal_days)) {
				
				// close proposal and return that closers passed
				log.info(`Proposal/Apply: Failure: ${proposal_id} Closing conditions passed`)
				return await close_proposal(api_proposal, reply, log, proposal_id, 204, false, false)
			}

			// check all applicable democracy rules pass
			if(check_rules(get_rules(changes, rules, algos, false), false, votes_yes, votes_no, population, proposal_days)) {

					// apply changes
					let a = {}
					a[target] = lib_json.apply_changes(changes, contents)

					// save changes
					let rows = await db('democracy').update(a).where({ id: democracy_id }).returning('*')
					if(!rows || rows.length < 1) {
						log.error(`Proposal/Apply: Failure: ${proposal_id},${democracy_id} Error: Unable to update democracy`)
						return reply.code(500).send(new Error(internal_error))
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
 * 			close: { lifetime_maximum_days: 3 }
 * 		} 
 * 	}
 * 	algos: { 
 * 		approval_percent_minimum: 'approved_votes > value' 
 * 		lifetime_maximum_days: 'proposal_days <= value'
 * 	}
 * 	close: boolean
 * Output: 
 * 	if close is true: [
 * 		{ 'proposal_days <= value': 14 },
 * 		{ 'proposal_days <= value': 3 }
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
const get_rules = function(changes, rules, algos, close) {
	let to_check = []
	let lookup
	if(close) {
		lookup = { 'close': '_close' }
	} else {
		lookup = { 'add': '_add', 'update': '_update', 'delete': '_delete' }
	}
	for(const i in rules) {
		if(i in lookup && (lookup[i] in changes || i === 'close')) {
			for(const j in rules[i]) {
				if(!(j in algos)) {
					throw new Error(algo_missing)
				}
				a = {}
                        	a[ algos[j] ] = rules[i][j]
				to_check.push(a)
			}
		} else if(i in changes) {
	       		to_check = to_check.concat(get_rules(changes[i], rules[i], algos, close))
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
