  
const ballot_verified_update = async function(request, reply, db, log, lib) {

	const { time_start, time_end } = request
	const { api_membership } = lib

	try {
		// use time window in request
		let args = {
			limit: 100,
			order: 'ASC',
			sort: 'date_updated',
			filter: {
				'date_updated': {
					'op': 'BETWEEN',
					'val': [time_start, time_end]
				}
			}
		}
		log.info(`Ballot/Verify: Starting: ${time_start} - ${time_end}`)

		let stopped = false
		while(!stopped) {

			// fetch memberships
			let mems = await api_membership.membership_list(args)

			// update democracies
			for(let mem of mems) {
				await db('ballot')
					.update({
						is_verified: mem.is_verified,
					})
					.where({
						membership_id: mem.membership_id
					})
			}

			// see if there's more to fetch
			if(mems.length < args.limit) {
				stopped = true
				log.info(`Ballot/Verify: Finished fetching memberships`)
			} else {
				args.last = (mems[(mems.length-1)])[args.sort]
				log.info(`Ballot/Verify: Fetching more memberships`)
			}
		}

		log.info(`Ballot/Verify: Success: ${time_start} - ${time_end}`)
		return reply.code(200).send()

	} catch (e) {
		log.error(`Ballot/Verify: Failure: ${time_start} - ${time_end} Error: ${e}`)
		return reply.code(500).send(e)
	}
}

module.exports = ballot_verified_update
