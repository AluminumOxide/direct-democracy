const auth = require('../../helpers/auth')
const { invalid_auth } = require('../../errors.json')

const proposal_read = async function(request, reply, db, log, lib) {

	const { proposal_id } = request
	const { api_proposal } = lib

	try {
		// fetch from proposal service
		const prop = await api_proposal.proposal_read({ proposal_id })

		// get membership_id
		const profile_id = await auth.get_profile_id(request, log)
		const membership_id = await auth.get_membership_id(profile_id, prop.democracy_id, log)

		// handle invalid membership_id
		if(prop.membership_id !== membership_id) {
			log.warn(`Proposal/Read: Failure: ${proposal_id} Error: Invalid auth`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// return results
		log.info(`Proposal/Read: Success: ${proposal_id}`)
		return reply.code(200).send(prop)

	} catch(e) {

		// handle invalid proposal_id
		if(e.message === api_proposal.errors.proposal_dne) {
			log.warn(`Proposal/Read: Failure: ${proposal_id} Error: Proposal does not exist`)
			return reply.code(400).send(new Error(api_proposal.errors.proposal_dne))
		}

		// handle other errors
		log.error(`Proposal/Read: Failure: ${proposal_id} Error: ${e}`)
		return reply.code(500).send(new Error(api_proposal.errors.internal_error))
	}
}

module.exports = proposal_read
