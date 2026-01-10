const { internal_error, membership_dne } = require('../../errors.json')

const membership_verify = async function(request, reply, db, log, lib) {

	const { membership_id } = request

	try {
		const rows = await db('membership')
		.update({ is_verified: true, is_verifying: false })
		.where({ id: membership_id })
		.returning({
			membership_id: 'membership.id',
			democracy_id: 'membership.democracy_id',
			profile_id: 'membership.profile_id',
			is_verified: 'membership.is_verified',
			is_verifying: 'membership.is_verifying',
			date_created: 'membership.date_created',
			date_updated: 'membership.date_updated'
		})
	
		if(!rows || rows.length < 1) {
			log.warn(`Membership/Verify: Failure: ${membership_id} Error: Membership does not exist`)
			return reply.code(400).send(new Error(membership_dne))
		}
		log.info(`Membership/Verify: Success: ${membership_id}`)
		return reply.code(200).send(rows[0])

	} catch(e) {
		log.error(`Membership/Verify: Failure: ${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = membership_verify
