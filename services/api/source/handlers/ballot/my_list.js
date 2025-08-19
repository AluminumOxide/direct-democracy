const { invalid_auth, internal_error } = require('../../errors.json')

const ballot_my_list = async function(request, reply, db, log, lib) {

	let { limit, last, sort, order, filter={}, jwt } = request
	const { api_profile, api_proposal, api_membership } = lib

	try {
		// validate jwt
		const { profile_id } = await api_profile.sign_in_verify({ jwt })
		if(!profile_id) {
			// shouldn't happen
			log.error(`Ballot/List: Failure: ${jwt} Error: JWT verify`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// get membership ids
		const memberships = await api_membership.membership_list({
			filter: {
				profile_id: { op: '=', val: profile_id }
			}
		})
		const membership_ids = memberships.map((x) => x.membership_id )

		// add membership ids to filter
		filter['membership_id'] = { op: 'IN', val: membership_ids }

		// fetch from proposal service
		const ballots = await api_proposal.ballot_list({ limit, last, sort, order, filter })

		// return results
		log.info(`Ballot/List: Success`)
		return reply.code(200).send(ballots)

	} catch(e) {

		// handle invalid jwt
		if(e.message === api_profile.errors.invalid_auth) {
			log.warn(`Ballot/List: Failure: ${jwt} Error: Invalid token`)
			return reply.code(401).send(new Error(invalid_auth))
		}
		
		// handle errors
		log.error(`Ballot/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = ballot_my_list
