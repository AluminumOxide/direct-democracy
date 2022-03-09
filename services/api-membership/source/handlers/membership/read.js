
const membership_read = async function(request, reply, db, log) {
	const { membership_id } = request
	
	const rows = await db('membership')
	.select({
    membership_id: 'membership.id',
    democracy_id: 'membership.democracy_id',
		profile_id: 'membership.profile_id',
		is_verified: 'membership.is_verified',
    date_created: 'membership.date_created',
    date_updated: 'membership.date_updated'
	})
	.where('membership.id', membership_id)

	if(!rows || rows.length < 1) {
		log.error('Membership/Read: Failure('+membership_id+')')
		return reply.code(400).send('Membership/Read: Failure('+membership_id+')')
  }
	log.info('Membership/Read: Success('+membership_id+')')
	return reply.code(200).send(rows[0])
}

module.exports = membership_read
