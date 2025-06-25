const auth = require('../../helpers/auth')

const proposal_delete = async function(request, reply, db, log, lib) {

 	const { proposal_id } = request
	const { api_proposal } = lib

	try {
		// get proposal	
		const prop = await api_proposal.proposal_read({ proposal_id })

		// get auth info
		const profile_id = await auth.get_profile_id(request, log)
		const membership_id = await auth.get_membership_id(profile_id, prop.democracy_id, log)

		// check membership_id
		if(prop.membership_id !== membership_id) {
		        log.warn(`Proposal/Delete: Failure: ${proposal_id},${membership_id} Error: Invalid membership`)
		        return reply.code(400).send(new Error(api_proposal.errors.membership_invalid))
		}
  
		// delete from proposal service
		await api_proposal.proposal_delete({ proposal_id })

		// return results
		log.info(`Proposal/Delete: Success: ${proposal_id}`)
		return reply.code(204).send()

	} catch(e) {

		// handle invalid proposal_id
		if(e.message === api_proposal.errors.proposal_dne) {
			log.warn(`Proposal/Delete: Failure: Error: Proposal does not exist`)
			return reply.code(400).send(new Error(api_proposal.errors.proposal_dne))
		}

		// handle all other errors
		log.error(`Proposal/Delete: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(api_proposal.errors.internal_error))
	}
}

module.exports = proposal_delete
