const { internal_error } = require('../../errors.json')

const membership_list = async function(request, reply, db, log) {
	const { limit, last, sort, order, filter } = request

	try {
		const rows = await db.pageQuery(limit, last, sort, order, filter,
			db.select({
				membership_id: 'membership.id',
				democracy_id: 'membership.democracy_id',
				profile_id: 'membership.profile_id',
				is_verified: 'membership.is_verified',
				date_created: 'membership.date_created'
			}).select(db.raw('greatest(date_created,date_updated) as date_updated'))
			.from('membership'))

		log.info('Membership/List: Success')
		return reply.code(200).send(rows)

	} catch(e) {
		log.error(`Membership/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = membership_list
