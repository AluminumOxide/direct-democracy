const { invalid_auth, internal_error } = require('../../errors.json')

const proposal_delete = async function(request, reply, db, log, lib) {

 	const { proposal_id, jwt } = request
	const { api_profile, api_proposal, api_membership } = lib

	try {
		// validate jwt
		const { profile_id } = await api_profile.sign_in_verify({ jwt })
		if(!profile_id) {
			// shouldn't happen
			log.error(`Proposal/Delete: Failure: ${jwt} Error: JWT verify`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// get proposal	
		const prop = await api_proposal.proposal_read({ proposal_id })

		// get membership
		const membership = await api_membership.membership_list({
			filter: {
				democracy_id: { op: '=', val: prop.democracy_id },
				profile_id: { op: '=', val: profile_id }
			}
		})

		// check membership
		if(membership.length === 0) {
			log.warn(`Proposal/Delete: Failure: Error: Invalid Auth`)
			return reply.code(401).send(new Error(api_proposal.errors.invalid_auth))
		}
		if(membership.length > 1) {
			// should never happen
			log.error(`Proposal/Create: Failure: Error: Duplicate Membership`)
			return reply.code(500).send(new Error(api_proposal.errors.internal_error))
		}
		
		const membership_id = membership[0].membership_id
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

		// handle invalid jwt
		if(e.message === api_profile.errors.invalid_auth) {
			log.warn(`Proposal/Delete: Failure: ${jwt} Error: Invalid token`)
			return reply.code(401).send(new Error(invalid_auth))
		}

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
