const dem_client = require('@AluminumOxide/direct-democracy-democracy-api-client')

const democracy_list = async function(request, reply, db, log) {
	const { limit, last, sort, order, filter } = request

	try {
		// fetch from democracy service
		const dems = await dem_client.democracy_list({ limit, last, sort, order, filter })

		// return results
		log.info('Democracy/List: Success')
		return reply.code(200).send(dems)

	} catch(e) {

		// handle errors
		log.error(`Democracy/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(dem_client.errors.internal_error))
	}
}

module.exports = democracy_list
