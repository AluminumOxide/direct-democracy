const { validate_jwt } = require('../../helpers/auth')

const proposal_list = async function(request, reply, db, log, lib) {

 	let { limit, last, sort, order, filter={}, jwt } = request
	const { api_proposal, api_membership } = lib

	try {
		// validate jwt
		const profile_id = await validate_jwt(jwt)

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

		// handle errors
		log.error(`Proposal/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(api_proposal.errors.internal_error))
	}
}

module.exports = proposal_list
