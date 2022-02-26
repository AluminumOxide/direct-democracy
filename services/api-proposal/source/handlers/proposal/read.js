
const proposal_read = async function(request, reply, db, log) {
	const { proposal_id } = request

	// get proposal
	const rows = await db('proposal')
	.select({
		'proposal_id': 'id',
		'democracy_id': 'democracy_id',
		'membership_id': 'membership_id',
		'proposal_name': 'name',
		'proposal_description': 'description',
		'proposal_target': 'target',
		'proposal_changes': 'changes',
		'proposal_votable': 'votable',
		'date_created': 'date_created',
		'date_updated': 'date_updated'
	})
	.where({ id: proposal_id })
	if(!rows || rows.length < 1) {
		log.error('Proposal/Read: Failure('+proposal_id+')')
		return reply.code(400).send()
  }
	let proposal = rows[0]

	// count ballots
	const counts = await db('ballot')
	.select([
		'is_approved'
	])
	.count('id', {as: 'cnt'})
	.groupBy('is_approved')
	.orderBy('is_approved')
	.where({ 'proposal_id': proposal_id})
	if(!counts || counts.length < 1) {
		proposal.proposal_votes = {'yes': 0, 'no': 0}
	} else {
		proposal.proposal_votes = {'yes': counts[0].cnt, 'no': counts.length > 1 ? counts[1].cnt : 0}
	}

	// return results
	log.info('Proposal/Read: Success('+proposal_id+')')
	return reply.code(200).send(proposal)
}

module.exports = proposal_read
