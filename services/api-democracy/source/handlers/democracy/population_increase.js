const { internal_error, democracy_dne } = require('../../errors.json')

const democracy_population_increase = async function(request, reply, db, log) {
	const { democracy_id } = request

	try {
		const dem = await db('democracy')
			.select('population')
			.where({ id: democracy_id })

		if(!dem || dem.length === 0) {
			log.warn(`Democracy/Population/Increase: Failure: ${democracy_id} Error: Democracy does not exist`)
			return reply.code(400).send(new Error(democracy_dne))
		}

		await db('democracy')
			.increment('population', 1)
			.where('id', democracy_id)
	
		log.info(`Democracy/Population/Increase: Success: ${democracy_id}`)
		return reply.code(201).send()

	} catch(e) {
		log.error(`Democracy/Population/Increase: Failure: ${democracy_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = democracy_population_increase
