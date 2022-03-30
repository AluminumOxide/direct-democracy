const { internal_error, democracy_dne } = require('../../errors.json')

const democracy_read = async function(request, reply, db, log) {
	const { democracy_id } = request

	try {
		const rows = await db('democracy')
		.select({
			democracy_id: 'democracy.id',
			democracy_name: 'democracy.name',
			democracy_description: 'democracy.description',
			democracy_population: 'democracy.population',
			democracy_rules: 'democracy.rules',
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
