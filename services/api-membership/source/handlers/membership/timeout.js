const { internal_error, membership_dne } = require('../../errors.json')

const membership_timeout = async function(request, reply, db, log, lib) {

	const { membership_id, timeout_days, proposal_id } = request
	const { api_membership } = lib

	try {
		// get membership
		const mem = await api_membership.membership_read({ membership_id })
		
		// calculate timeout start
		let timeout_start = mem.timeout_end
		if(!timeout_start) {
			timeout_start = new Date()
		} else if(new Date(timeout_start) < new Date()) {
			timeout_start = new Date()
		}
		timeout_start = new Date(timeout_start).toISOString()

		// calculate timeout end
		let timeout_end = new Date(timeout_start)
		timeout_end = timeout_end.setDate(timeout_end.getDate() + timeout_days)
		timeout_end = new Date(timeout_end).toISOString()
	
		// calculate timeout count and total
		let timeout_count = mem.timeout_count + 1
		let timeout_total = mem.timeout_total + timeout_days

		// add proposal to timeout proposals list
		let timeout_history = !!mem.timeout_history ? mem.timeout_history : {}
		timeout_history[timeout_start+'/'+timeout_end] = proposal_id
		timeout_history = JSON.stringify(timeout_history)

		// update membership
		const rows = await db('membership')
			.update({ timeout_end, timeout_count, timeout_total, timeout_history })
			.where({ id: membership_id })
			.returning('timeout_end')

		// handle update errors
		if(!rows || rows.length < 1) {
			log.error(`Membership/Timeout: Failure: ${membership_id} Error: Update failure ${timeout_end} ${timeout_history}`)
			return reply.code(500).send(new Error(internal_error))
		}

		// return success
		log.info(`Membership/Timeout: Success: ${membership_id}`)
		return reply.code(201).send()

	} catch(e) {

		// handle membership dne
		if(e.message === membership_dne) {
			log.warn(`Membership/Timeout: Failure: ${membership_id} Error: Membership DNE`)
			return reply.code(400).send(new Error(membership_dne))
		}

		// handle all other errors
		log.error(`Membership/Timeout: Failure: ${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = membership_timeout
