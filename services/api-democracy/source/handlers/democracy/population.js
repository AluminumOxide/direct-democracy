const { internal_error } = require('../../errors.json')
const api_membership_client = require('@AluminumOxide/direct-democracy-membership-api-client')
  
const democracy_population_update = async function(request, reply, db, log) {

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
			sort: 'democracy_id',
			filter: {
				'date_updated': {
					'op': 'BETWEEN',
					'val': [time_start, time_end]
				}
			}
		}

		// continue to fetch updates until we run out
		let stopped = false
		while(!stopped) {

			// fetch democracies and populations
			log.info(`Democracy/Population: Processing: ${time_start} - ${time_end}`)
			let pops = await api_membership_client.membership_population(args)

			// update democracies
			for(let pop of pops) {
				await db('democracy')
					.update({
						population_verified: pop.verified,
						population_unverified: pop.unverified
					})
					.where({
						id: pop.democracy_id
					})
			}

			// see if there's more to fetch
			if(pops.length < args.limit) {
				stopped = true
			} else {
				args.last = (pops[(pops.length-1)])[args.sort]
			}
		}

		// return succcess
		log.info(`Democracy/Population: Success`)
		return reply.code(200).send()

	} catch (e) {

		// handle errors
		log.error(`Democracy/Population: Failure: ${time_start} - ${time_end} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = democracy_population_update
