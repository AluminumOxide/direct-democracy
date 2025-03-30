const { internal_error } = require('../../errors.json')

const democracy_list = async function(request, reply, db, log, lib) {
	const { limit, last, sort, order, filter } = request

	try {
		const rows = await db.pageQuery(limit, last, sort, order, filter,
			db.select({
				democracy_id: 'democracy.id',
				democracy_name: 'democracy.name',
				democracy_description: 'democracy.description',
				democracy_population_verified: 'democracy.population_verified',
				democracy_population_unverified: 'democracy.population_unverified',
				date_created: 'democracy.date_created',
				date_updated: 'democracy.date_updated'
			})
			.from('democracy'))

		log.info('Democracy/List: Success')
		return reply.code(200).send(rows)

	} catch (e) {
		log.error(`Democracy/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = democracy_list
