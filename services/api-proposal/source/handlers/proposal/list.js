
const proposal_list = async function(request, reply, db, log) {
	const { limit, last, sort, order, filter } = request

	const rows = await db.pageQuery(limit, last, sort, order, filter,
		db('proposal').select({
			'proposal_id': 'id',
			'proposal_name': 'name',
			'proposal_description': 'description',
			'proposal_target': 'target',
			'proposal_changes': 'changes',
			'democracy_id': 'democracy_id',
			'membership_id': 'membership_id',
			'proposal_votable': 'votable',
			'date_created': 'date_created',
			'date_updated': 'date_updated'
		}))

	log.info('Proposal/List: Success')
	return reply.code(200).send(rows)
}

module.exports = proposal_list
