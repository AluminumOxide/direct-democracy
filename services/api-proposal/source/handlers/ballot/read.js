
const ballot_read = async function(request, reply, db, log) {
	const { ballot_id, proposal_id } = request

	const rows = await db('ballot')
	.select({
		'ballot_id': 'id',
		'proposal_id': 'proposal_id',
		'membership_id': 'membership_id',
		'is_approved': 'is_approved',
		'ballot_comments': 'comments',
		'ballot_modifiable': 'modifiable',
		'date_created': 'date_created',
		'date_updated': 'date_updated'
	})
	.where({
		'id': ballot_id,
		'proposal_id': proposal_id
	})

	if(!rows || rows.length < 1) {
		log.error('Ballot/Read: Failure('+ballot_id+')')
		return reply.code(400).send()
  }
	log.info('Ballot/Read: Success('+ballot_id+')')
	return reply.code(200).send(rows[0])
}

module.exports = ballot_read
