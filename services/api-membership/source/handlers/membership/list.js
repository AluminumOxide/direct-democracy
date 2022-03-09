
const membership_list = async function(request, reply, db, log) {
  const { limit, last, sort, order, filter } = request

  const rows = await db.pageQuery(limit, last, sort, order, filter,
    db.select({
      membership_id: 'membership.id',
      democracy_id: 'membership.democracy_id',
			profile_id: 'membership.profile_id',
			is_verified: 'membership.is_verified',
      date_created: 'membership.date_created',
      date_updated: 'membership.date_updated'
    })
    .from('membership'))

  log.info('Membership/List: Success')
  return reply.code(200).send(rows)
}

module.exports = membership_list
