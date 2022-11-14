const { internal_error, democracy_dne } = require('../../errors.json')

const democracy_root = async function(request, reply, db, log) {
	try {
		const rows = await db('democracy')
		.select({
			democracy_id: 'democracy.id',
			democracy_name: 'democracy.name',
			democracy_description: 'democracy.description',
			democracy_population_verified: 'democracy.population_verified',
			democracy_population_unverified: 'democracy.population_unverified',
			democracy_conduct: 'democracy.conduct',
			democracy_content: 'democracy.content',
			democracy_metas: 'democracy.metas',
			date_created: 'democracy.date_created',
			date_updated: 'democracy.date_updated'
		})
		.whereNull('democracy.parent_id')

		if(!rows || rows.length < 1) {
			log.warn(`Democracy/Root: Failure: Error: Democracy does not exist`)
			return reply.code(400).send(new Error(democracy_dne))
		}

		log.info(`Democracy/Root: Success`)
		return reply.code(200).send(rows[0])

	} catch(e) {
		log.error(`Democracy/Root: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = democracy_root
