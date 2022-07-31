const { internal_error } = require('../../errors.json')

const membership_population = async function(request, reply, db, log) {
	let { limit, last, sort, order, filter } = request

	try {
		const rows = await db.pageQuery(limit, last, sort, order, filter,
			db.select({
				'democracy_id': 'democracy_id',
				'population': 'population',
				'date_updated': 'date_updated'
			})
			.from('population'))

		log.info('Membership/Population: Success')
		return reply.code(200).send(rows)

	} catch(e) {
		log.error(`Membership/Population: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = membership_population
