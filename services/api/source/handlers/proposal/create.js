const auth = require('../../helpers/auth')
const { invalid_auth } = require('../../errors.json')

const proposal_create = async function(request, reply, db, log, lib) {

  	const { democracy_id, proposal_name, proposal_description, proposal_target, proposal_changes } = request
	const { api_proposal } = lib

	try {
		// get auth info
		const profile_id = await auth.get_profile_id(request, log)
		const membership_id = await auth.get_membership_id(profile_id, democracy_id, log)

		// send to proposal service
		const prop = await api_proposal.proposal_create({ democracy_id, membership_id, proposal_name, proposal_description, proposal_target, proposal_changes })

		// return results
		log.info(`Proposal/Create: Success: ${prop.proposal_id}`)
		return reply.code(201).send(prop)

	} catch(e) {

		// handle invalid democracy
		if(e.message === api_proposal.errors.democracy_invalid) {
			log.warn(`Proposal/Create: Failure: ${democracy_id} Error: Invalid democracy`)
			return reply.code(400).send(new Error(api_proposal.errors.democracy_invalid))
		}

		// handle invalid membership
		if(e.message === api_proposal.errors.membership_dne) {
			log.warn(`Proposal/Create: Failure: Error: Membership does not exist`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// handle all other errors
		log.error(`Proposal/Create: Failure: ${democracy_id} Error: ${e}`)
		return reply.code(500).send(new Error(api_proposal.errors.internal_error))
	}
}

module.exports = proposal_create
