const api_membership_client = new (require('@AluminumOxide/direct-democracy-membership-api-client'))()
  
const ballot_verified_update = async function(request, reply, db, log) {

	// calculate time window
	const time_window = 5 // min
	let time_end = new Date()
	let time_start = (new Date(time_end.getTime() - time_window*60000)).toISOString()
	time_end = time_end.toISOString()
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
		let stopped = false
		while(!stopped) {

			// fetch memberships
			let mems = await api_membership_client.membership_list(args)

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
			} else {
				args.last = (mems[(mems.length-1)])[args.sort]
			}
		}

		return reply.code(200).send()

	} catch (e) {
		return reply.code(500).send(e)
	}
}

module.exports = ballot_verified_update
