const { invalid_auth, internal_error } = require('../../errors.json')

const proposal_my_list = async function(request, reply, db, log, lib) {

 	let { limit, last, sort, order, filter={}, jwt } = request
	const { api_profile, api_proposal, api_membership } = lib

	try {
		// validate jwt
		const { profile_id } = await api_profile.sign_in_verify({ jwt })
		if(!profile_id) {
			// shouldn't happen
			log.error(`Proposal/List: Failure: ${jwt} Error: JWT verify`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// get membership ids
		const membership = await api_membership.membership_list({
			filter: {
				profile_id: { op: '=', val: profile_id }
			}
		})
	
		// add membership filter
		if(membership.length > 0) {
			const membership_ids = membership.map((x) => x.membership_id)
			filter['membership_id'] = { op: 'IN', val: membership_ids }
		}

		// fetch from proposal service
		const prop = await api_proposal.proposal_list({ limit, last, sort, order, filter })

		// return results
		log.info(`Proposal/List: Success`)
		return reply.code(200).send(prop)

	} catch(e) {

		// handle invalid jwt
		if(e.message === api_profile.errors.invalid_auth) {
			log.warn(`Proposal/List: Failure: ${jwt} Error: Invalid token`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// handle errors
		log.error(`Proposal/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(api_proposal.errors.internal_error))
	}
}

module.exports = proposal_my_list
