
const democracy_read = async function(request, reply, db, log, lib) {

 	const { democracy_id } = request
	const { api_democracy } = lib

	try {
		// fetch from democracy service
		let dem = await api_democracy.democracy_read({ democracy_id })

		// sort out code of conduct
		let tmp = Object.assign({}, dem)
		dem.democracy_conduct = []
		while(!!tmp) {

			// rearrange code of conduct
			let coc = []
			Object.keys(tmp.democracy_conduct).map(c => coc[tmp.democracy_conduct[c].order-1] = {
				[c]: { description: tmp.democracy_conduct[c].description, democracy_id: tmp.democracy_id }
			})
			dem.democracy_conduct = coc.concat(dem.democracy_conduct)
		
			// get parents' code of conduct
			if(!!tmp.democracy_parent.id) {
				tmp = await api_democracy.democracy_read({ democracy_id: tmp.democracy_parent.id })
			} else {
				tmp = false
			}
		}

		// return results
		log.info(`Democracy/Read: Success: ${democracy_id}`)
		return reply.code(200).send(dem)

	} catch(e) {

		// error if democracy_id invalid
		if(e.message === api_democracy.errors.democracy_dne) {
			log.warn(`Democracy/Read: Failure: ${democracy_id} Error: Democracy does not exist`)
			return reply.code(400).send(new Error(api_democracy.errors.democracy_dne))
		}

		// handle other errors
		log.error(`Democracy/Read: Failure: ${democracy_id} Error: ${e}`)
		return reply.code(500).send(new Error(api_democracy.errors.internal_error))
	}
}

module.exports = democracy_read
