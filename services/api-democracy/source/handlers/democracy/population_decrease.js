const { internal_error, democracy_dne, democracy_pop } = require('../../errors.json')

const democracy_population_decrease = async function(request, reply, db, log) {
	const { democracy_id } = request

	try {
		const dem = await db('democracy')
			.select('population')
			.where({ id: democracy_id })

		if(!dem || dem.length === 0) {
			log.warn(`Democracy/Population/Decrease: Failure: ${democracy_id} Error: Democracy does not exist`)
			return reply.code(400).send(new Error(democracy_dne))
		}

		if(!dem[0].population || dem[0].population === 0) {
			log.warn(`Democracy/Population/Decrease: Failure: ${democracy_id} Error: Democracy has population of 0`)
			return reply.code(400).send(new Error(democracy_pop))
		}

		await db('democracy')
			.decrement('population', 1)
			.where('id', democracy_id)
	
		log.info(`Democracy/Population/Decrease: Success: ${democracy_id}`)
		return reply.code(201).send()

	} catch(e) {
		log.error(`Democracy/Population/Decrease: Failure: ${democracy_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = democracy_population_decrease
