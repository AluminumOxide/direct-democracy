const mem_client = require('@AluminumOxide/direct-democracy-membership-api-client')
const { internal_error } = require('../../errors.json')

const ballot_list = async function(request, reply, db, log) {
	const { limit, last, sort, order, filter } = request

	try {
		// handle filter by profile_id
		if(!!filter && 'profile_id' in filter) {
			await mem_client.ready()
			const memberships = await mem_client.membership_list({ filter: { profile_id: { op: '=', val: profile_id }}})
			filter["membership_id"] = { "op": "IN", "val": memberships.map(x => x.membership_id)}
			delete filter['profile_id']
		}

		// list ballots
		const rows = await db
			.pageQuery(limit, last, sort, order, filter,
				db('ballot').select({ 
					'ballot_id': 'id',
					'membership_id': 'membership_id',
					'proposal_id': 'proposal_id',
					'ballot_approved': 'is_approved',
					'ballot_comments': 'comments',
					'ballot_modifiable': 'modifiable',
					'date_created': 'date_created',
					'date_updated': 'date_updated'
				}))	

		log.info('Ballot/List: Success')
		return reply.code(200).send(rows)

	} catch(e) {
		log.error(`Ballot/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = ballot_list
