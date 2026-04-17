const { internal_error, membership_dne } = require('../../errors.json')

const membership_timeout = async function(request, reply, db, log, lib) {

	const { membership_id, timeout_days, proposal_id } = request
	const { api_democracy, api_membership } = lib

	try {
		// get membership
		let mem = await api_membership.membership_read({ membership_id })
		
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

		// update decendant memberships
		const update_children = async function(democracy_id, profile_id) {
			
			// get democracy
			const dem = await api_democracy.democracy_read({ democracy_id })
			
			// go through each child
			!!dem.democracy_children && dem.democracy_children.map(async ({ id }) => {
		
				// get the child membership
				let rows = await db('membership')
					.select(['id','timeout_end','timeout_history'])
					.where({ democracy_id: id, profile_id })
				
				// only if they have a membership
				if(!!rows && rows.length === 1) {
		
					// calculate timeout end
					let mem = rows[0]
					if(!!mem.timeout_end && new Date(mem.timeout_end) < new Date(timeout_end)) {
						mem.timeout_end = timeout_end
					} else if(!mem.timeout_end) {
						mem.timeout_end = timeout_end
					}
		
					// calculate timeout history
					if(!mem.timeout_history) {
						mem.timeout_history = {}
					}
					mem.timeout_history[timeout_start+'/'+timeout_end] = proposal_id
					mem.timeout_history = JSON.stringify(mem.timeout_history)
		
					// update child membership
					rows = await db('membership')
						.update({ timeout_end: mem.timeout_end, timeout_history: mem.timeout_history })
						.where({ id: mem.id })
		
					// handle update errors
					if(!rows || rows.length < 1) {
						log.error(`Membership/Timeout: Failure: ${profile_id} Error: Update failure ${id}`)
						return reply.code(500).send(new Error(internal_error))
					}
				}
		
				// update this democracy's children
				await update_children(id, profile_id)
			}) 
		}
		await update_children(mem.democracy_id, mem.profile_id)

		// return success
		log.info(`Membership/Timeout: Success: ${membership_id}`)
		return reply.code(201).send()

	} catch(e) {

		// handle membership dne
		if(e.message === membership_dne) {
			log.warn(`Membership/Timeout: Failure: ${membership_id} Error: Membership DNE`)
			return reply.code(400).send(new Error(membership_dne))
		}
		
		// handle democracy dne
		if(e.message === api_democracy.errors.democracy_dne) {
			log.warn(`Membership/Timeout: Failure: Error: Democracy DNE`)
			return reply.code(400).send(new Error(api_democracy.errors.democracy_dne))
		}

		// handle all other errors
		log.error(`Membership/Timeout: Failure: ${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = membership_timeout
