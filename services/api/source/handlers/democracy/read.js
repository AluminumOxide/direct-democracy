const dem_client = new (require('@AluminumOxide/direct-democracy-democracy-api-client'))()

const democracy_read = async function(request, reply, db, log) {
 	const { democracy_id } = request

	try {
		// fetch from democracy service
		const dem = await dem_client.democracy_read({ democracy_id })

		// return results
		log.info(`Democracy/Read: Success: ${democracy_id}`)
		return reply.code(200).send(dem)

	} catch(e) {
console.log(e)
		// error if democracy_id invalid
		if(e.message === dem_client.errors.democracy_dne) {
			log.warn(`Democracy/Read: Failure: ${democracy_id} Error: Democracy does not exist`)
			return reply.code(400).send(new Error(dem_client.errors.democracy_dne))
		}

		// handle other errors
		log.error(`Democracy/Read: Failure: ${democracy_id} Error: ${e}`)
		return reply.code(500).send(new Error(dem_client.errors.internal_error))
	}
}

module.exports = democracy_read
