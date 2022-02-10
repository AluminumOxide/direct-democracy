
const democracy_list = async function(request, reply, db, log) {
  const { limit, last, sort, order, filter } = request

  const rows = await db.pageQuery(limit, last, sort, order, filter,
    db.select({
      democracy_id: 'democracy.id',
      democracy_name: 'democracy.name',
      democracy_description: 'democracy.description',
      date_created: 'democracy.date_created',
      date_updated: 'democracy.date_updated'
    })
    .from('democracy')
    .join('membership', 'democracy.id', '=', 'membership.democracy_id')
    .groupBy('democracy.id')
    .count('membership.id', {as: 'democracy_population'}))

  log.info('Democracy/List: Success')
  return reply.code(200).send(rows)
}

module.exports = democracy_list
