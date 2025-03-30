const { internal_error } = require('../../errors.json')

const democracy_population_update = async function(request, reply, db, log, lib) {

	const { time_start, time_end } = request
	const { api_membership } = lib

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
		log.info(`Democracy/Population: Starting: ${time_start} - ${time_end}`)

		// continue to fetch updates until we run out
		let stopped = false
		while(!stopped) {

			// fetch democracies and populations
			let pops = await api_membership.membership_population(args)
			
			// update democracies
			for(let pop of pops) {
				await db('democracy')
					.update({
						population_verified: pop.population_verified,
						population_unverified: pop.population_unverified
					})
					.where({
						id: pop.democracy_id
					})
			}

			// see if there's more to fetch
			if(pops.length < args.limit) {
				stopped = true
				log.info(`Democracy/Population: Finished fetching populations`)
			} else {
				args.last = (pops[(pops.length-1)])[args.sort]
				log.info(`Democracy/Population: Fetching more populations`)
			}
		}

		// return succcess
		log.info(`Democracy/Population: Success: ${time_start} - ${time_end}`)
		return reply.code(200).send()

	} catch (e) {

		// handle errors
		log.error(`Democracy/Population: Failure: ${time_start} - ${time_end} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = democracy_population_update
