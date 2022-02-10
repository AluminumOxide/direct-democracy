
const democracy_read = async function(request, reply, db, log) {
	const { democracy_id } = request
	
	const rows = await db('democracy')
	.join('membership', 'democracy.id', '=', 'membership.democracy_id')
	.groupBy('democracy.id')
	.select({
    democracy_id: 'democracy.id',
    democracy_name: 'democracy.name',
    democracy_description: 'democracy.description',
		democracy_rules: 'democracy.rules',
		democracy_metas: 'democracy.metas',
    date_created: 'democracy.date_created',
    date_updated: 'democracy.date_updated'
	})
	.count('membership.id', {as: 'democracy_population'})
	.where('democracy.id', democracy_id)

	if(!rows || rows.length < 1) {
		log.error('Democracy/Read: Failure('+democracy_id+')')
		return reply.code(400).send('Democracy/Read: Failure('+democracy_id+')')
  }
	log.info('Democracy/Read: Success('+democracy_id+')')
	return reply.code(200).send(rows[0])
}

module.exports = democracy_read
