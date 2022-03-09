
const democracy_population_decrease = async function(request, reply, db, log) {
	const { democracy_id } = request

	const rows = await db('democracy')
		.decrement('population', 1)
		.where('id', democracy_id)

	log.info('Democracy/Population/Decrease: Success('+democracy_id+')')
	return reply.code(201).send()
}

module.exports = democracy_population_decrease
