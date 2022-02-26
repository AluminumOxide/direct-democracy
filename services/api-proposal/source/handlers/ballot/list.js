
const ballot_list = async function(request, reply, db, log) {
	const { limit, last, sort, order, filter } = request

	const rows = await db
		.pageQuery(limit, last, sort, order, filter,
			db('ballot').select({ 
				'ballot_id': 'id',
				'proposal_id': 'proposal_id',
				'membership_id': 'membership_id',
				'is_approved': 'is_approved',
				'ballot_comments': 'comments',
				'date_created': 'date_created',
				'date_updated': 'date_updated'
			}))	

	log.info('Ballot/List: Success')
	return reply.code(200).send(rows)
}

module.exports = ballot_list
