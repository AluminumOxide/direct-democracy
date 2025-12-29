const { invalid_auth, internal_error } = require('../../errors.json')

const ballot_delete = async function(request, reply, db, log, lib) {

	const { proposal_id, jwt } = request
	const { api_profile, api_proposal, api_membership } = lib

	try {
		// validate jwt
		const { profile_id } = await api_profile.sign_in_verify({ jwt })
		if(!profile_id) {
			// shouldn't happen
			log.error(`Ballot/Delete: Failure: ${jwt} Error: JWT verify`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// get proposal
		const proposal = await api_proposal.proposal_read({
			proposal_id
		})

		// get membership
		const membership = await api_membership.membership_list({
			filter: {
				democracy_id: { op: '=', val: proposal.democracy_id },
				profile_id: { op: '=', val: profile_id }
			}
		})

		// check membership
		if(membership.length === 0) {
			log.warn(`Ballot/Delete: Failure: Error: Invalid auth`)
			return reply.code(401).send(new Error(invalid_auth))
		}
		if(membership.length > 1) {
			// shouldn't happen
			log.error(`Ballot/Delete: Failure: Error: Duplicate Membership`)
			return reply.code(500).send(new Error(internal_error))
		}
		const membership_id = membership[0].membership_id
		
		// get ballot
		const ballot = await api_proposal.ballot_read({
			membership_id,
			proposal_id
		})

		// delete ballot 
		await api_proposal.ballot_delete({ proposal_id, membership_id })

		// return results
		log.info(`Ballot/Delete: Success`)
		return reply.code(204).send()

	} catch(e) {

		// handle invalid jwt
		if(e.message === api_profile.errors.invalid_auth) {
			log.warn(`Ballot/Delete: Failure: ${jwt} Error: Invalid token`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// handle invalid proposal_id
		if(e.message === api_proposal.errors.ballot_dne) {
			log.warn(`Ballot/Delete: Failure:  Error: Invalid proposal_id`)
			return reply.code(400).send(new Error(api_proposal.errors.ballot_dne))
		}

		// handle invalid proposal
		if(e.message === api_proposal.errors.proposal_dne) {
			log.warn(`Ballot/Delete: Failure:  Error: Invalid proposal`)
			return reply.code(400).send(new Error(api_proposal.errors.proposal_dne))
		}

		// handle closed ballot
		if(e.message === api_proposal.errors.ballot_closed) {
			log.warn(`Ballot/Delete: Failure:  Error: Ballot closed`)
			return reply.code(400).send(new Error(api_proposal.errors.ballot_closed))
		}

		// handle all other errors
		log.error(`Ballot/Delete: Failure:  Error: ${e}`)
		return reply.code(500).send(new Error(api_proposal.errors.internal_error))
	}
}

module.exports = ballot_delete
