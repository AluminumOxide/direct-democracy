const { internal_error } = require('../../errors.json')

const membership_list = async function(request, reply, db, log, lib) {

	const { limit, last, sort, order, filter } = request

	try {
		const rows = await db.pageQuery(limit, last, sort, order, filter,
			db.select({
				membership_id: 'membership.id',
				democracy_id: 'membership.democracy_id',
				profile_id: 'membership.profile_id',
				is_verified: 'membership.is_verified',
				date_created: 'membership.date_created',
				timeout_end: 'membership.timeout_end'
			}).select(db.raw('greatest(date_created,date_updated) as date_updated'))
			.select(db.raw('case when timeout_end is null or timeout_end < NOW() then false else true end as in_timeout'))
			.from('membership')
			.where({ is_deleted: false }))

		log.info('Membership/List: Success')
		return reply.code(200).send(rows)

	} catch(e) {
		log.error(`Membership/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = membership_list
