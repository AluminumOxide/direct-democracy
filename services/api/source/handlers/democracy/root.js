
const democracy_root = async function(request, reply, db, log, lib) {

	const { api_democracy } = lib

	try {
		// fetch from democracy service
		const dem = await api_democracy.democracy_root()

		// return results
		log.info(`Democracy/Root: Success`)
		return reply.code(200).send(dem)

	} catch(e) {

		// handle errors
		log.error(`Democracy/Root: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(api_democracy.errors.internal_error))
	}
}

module.exports = democracy_root
