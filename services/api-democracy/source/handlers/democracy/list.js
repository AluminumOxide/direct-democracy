const { internal_error } = require('../../errors.json')

const democracy_list = async function(request, reply, db, log, lib) {
	let { limit, last, sort, order, filter={} } = request

	if(!!filter['democracy_parent']) {
		filter['democracy_parent_id'] = Object.assign({}, filter['democracy_parent'])
		delete filter['democracy_parent']
	}

	try {
		const rows = await db.pageQuery(limit, last, sort, order, filter,
			db.select({
				democracy_id: 'democracy.id',
				democracy_name: 'democracy.name',
				democracy_description: 'democracy.description',
				democracy_population_verified: 'democracy.population_verified',
				democracy_population_unverified: 'democracy.population_unverified',
				date_created: 'democracy.date_created',
				date_updated: 'democracy.date_updated',
				democracy_conduct: 'democracy.conduct',
				democracy_content: 'democracy.content',
				democracy_metas: 'democracy.metas',
				democracy_parent_id: 'democracy.parent_id',
				democracy_parent: db.raw("json_build_object('id',b.id,'name',b.name)")
			})
			.fromRaw('democracy left outer join democracy b on democracy.parent_id = b.id'))

		log.info('Democracy/List: Success')
		return reply.code(200).send(rows)

	} catch (e) {
		log.error(`Democracy/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = democracy_list
