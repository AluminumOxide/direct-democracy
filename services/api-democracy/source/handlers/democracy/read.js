const { internal_error, democracy_dne } = require('../../errors.json')

const democracy_read = async function(request, reply, db, log) {
	const { democracy_id } = request
	try {
		const rows = await db('democracy')
		.select({
			democracy_id: 'democracy.id',
			democracy_parent: 'democracy.parent_id',
			democracy_children: db('democracy').select(db.raw('array_agg(democracy.id)')).where('democracy.parent_id', democracy_id).groupBy('democracy.parent_id'),
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
		.where('democracy.id', democracy_id)

		if(!rows || rows.length < 1) {
			log.warn(`Democracy/Read: Failure: ${democracy_id} Error: Democracy does not exist`)
			return reply.code(400).send(new Error(democracy_dne))
		}

		log.info(`Democracy/Read: Success: ${democracy_id}`)
		return reply.code(200).send(rows[0])

	} catch(e) {
		log.error(`Democracy/Read: Failure: ${democracy_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = democracy_read
