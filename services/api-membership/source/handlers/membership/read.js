const { internal_error, membership_dne } = require('../../errors.json')

const membership_read = async function(request, reply, db, log, lib) {

	const { membership_id } = request

	try {
		const rows = await db('membership')
		.select({
			membership_id: 'membership.id',
			democracy_id: 'membership.democracy_id',
			profile_id: 'membership.profile_id',
			is_verified: 'membership.is_verified',
			is_verifying: 'membership.is_verifying',
			verify_proposal: 'membership.verify_proposal',
			timeout_end: 'membership.timeout_end',
			timeout_count: 'membership.timeout_count',
			timeout_total: 'membership.timeout_total',
			timeout_history: 'membership.timeout_history',
			date_created: 'membership.date_created',
			date_updated: 'membership.date_updated'
		})
		.select(db.raw('case when timeout_end is null or timeout_end < NOW() then false else true end as in_timeout'))
		.where({ id: membership_id, is_deleted: false })
	
		if(!rows || rows.length < 1) {
			log.warn(`Membership/Read: Failure: ${membership_id} Error: Membership does not exist`)
			return reply.code(400).send(new Error(membership_dne))
		}
		log.info(`Membership/Read: Success: ${membership_id}`)
		return reply.code(200).send(rows[0])
	} catch(e) {
		log.error(`Membership/Read: Failure: ${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = membership_read
