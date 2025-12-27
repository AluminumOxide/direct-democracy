const { internal_error } = require('../../errors.json')

const democracy_list = async function(request, reply, db, log, lib) {

	const { limit, last, sort, order, filter } = request
	const { api_democracy } = lib
	try {
		// fetch from democracy service
		const dems = await api_democracy.democracy_list({ limit, last, sort, order, filter })

		// return results
		log.info('Democracy/List: Success')
		return reply.code(200).send(dems)

	} catch(e) {

		// handle errors
		log.error(`Democracy/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = democracy_list
