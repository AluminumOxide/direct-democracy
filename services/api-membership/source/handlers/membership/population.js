const { internal_error } = require('../../errors.json')

const membership_population = async function(request, reply, db, log) {
	let { limit, last, order, filter } = request
	try {
		const rows = await db.pageQuery(limit, last, 'democracy_id', order, filter,
			db.select([
				'democracy_id'
			])
			.sum({ verified: db.raw('case when is_verified then population else 0 end')})
			.sum({ unverified: db.raw('case when not is_verified then population else 0 end')})
			.select(db.raw('max(date_updated) as date_updated'))
			.from(
				db.select([
					'democracy_id',
					'is_verified'
				])
				.count('id', {as: 'population'})
				.select(db.raw('max(greatest(date_created, date_updated)) as date_updated'))
				.from('membership')
				.groupBy(['democracy_id', 'is_verified'])
				.orderBy(['democracy_id', 'is_verified']).as('a')
				)
			.groupBy('democracy_id')
		)

		log.info('Membership/Population: Success')
		return reply.code(200).send(rows)

	} catch(e) {
		log.error(`Membership/Population: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = membership_population
