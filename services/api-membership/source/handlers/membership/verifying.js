const { internal_error, membership_dne, membership_verified } = require('../../errors.json')

const membership_verifying = async function(request, reply, db, log, lib) {

	const { membership_id, proposal_id } = request
	const { api_membership } = lib

	try {

		// check membership exists
		const mem = await api_membership.membership_read({ membership_id })

		// check membership status update
		if(!!mem.is_verified || !!mem.is_verifying) {
			log.warn(`Membership/Verifying: Failure: ${membership_id} Error: Membership already verified or verifying`)
			return reply.code(400).send(new Error(membership_verified))
		}

		// update status
		const rows = await db('membership')
		.update({ is_verifying: true, verify_proposal: proposal_id })
		.where({ id: membership_id })
		.returning({
			membership_id: 'membership.id',
			democracy_id: 'membership.democracy_id',
			profile_id: 'membership.profile_id',
			is_verified: 'membership.is_verified',
			is_verifying: 'membership.is_verifying',
			verify_proposal: 'membership.verify_proposal',
			date_created: 'membership.date_created',
			date_updated: 'membership.date_updated'
		})

		// handle update error
		if(!rows || rows.length < 1) {
			log.error(`Membership/Verifying: Failure: ${membership_id} Error: Updating membership`)
			return reply.code(500).send(new Error(internal_error))
		}

		// return success
		log.info(`Membership/Verifying: Success: ${membership_id}`)
		return reply.code(200).send(rows[0])

	} catch(e) {

		// handle membership dne
		if(e.message === membership_dne) {
			log.warn(`Membership/Verifying: Failure: ${membership_id} Error: Membership does not exist`)
			return reply.code(400).send(new Error(membership_dne))
		}

		// handle all other errors
		log.error(`Membership/Verifying: Failure: ${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = membership_verifying
