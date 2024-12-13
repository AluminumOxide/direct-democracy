const prop_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
const auth = require('../../helpers/auth')

const ballot_list = async function(request, reply, db, log) {
	let { limit, last, sort, order, filter={} } = request

	try {
		// get membership_ids and add to filter
		const profile_id = await auth.get_profile_id(request, log)
		const memberships = await auth.get_membership_ids(profile_id)
		const membership_ids = memberships.map((x) => x.membership_id )
		filter['membership_id'] = { op: 'IN', val: membership_ids }

		// fetch from proposal service
		const ballots = await prop_client.ballot_list({ limit, last, sort, order, filter })

		// return results
		log.info(`Ballot/List: Success`)
		return reply.code(200).send(ballots)

	} catch(e) {
		
		// handle errors
		log.error(`Ballot/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(prop_client.errors.internal_error))
	}
}

module.exports = ballot_list
