const { internal_error, democracy_dne } = require('../../errors.json')

const democracy_read = async function(request, reply, db, log, lib) {
	const { democracy_id } = request
	try {
		const rows = await db
		.select({
			democracy_id: 'democracy.id',
			democracy_parent: db.raw("json_build_object('id',b.id,'name',b.democracy_name)"),
			democracy_children: db('democracy').select(db.raw("array_agg(json_build_object('id',democracy.id,'name',democracy.democracy_name))")).where('democracy.parent_id', democracy_id).groupBy('democracy.parent_id'),
			democracy_name: 'democracy.democracy_name',
			democracy_description: 'democracy.democracy_description',
			democracy_population_verified: 'democracy.population_verified',
			democracy_population_unverified: 'democracy.population_unverified',
			democracy_conduct: 'democracy.democracy_conduct',
			democracy_content: 'democracy.democracy_content',
			democracy_metas: 'democracy.democracy_metas',
			date_created: 'democracy.date_created',
			date_updated: 'democracy.date_updated'
		})
		.fromRaw('democracy left outer join democracy b on democracy.parent_id = b.id')
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
