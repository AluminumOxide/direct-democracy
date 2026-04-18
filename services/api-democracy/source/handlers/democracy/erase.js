const { democracy_dne, democracy_field, internal_error } = require('../../errors.json')

const democracy_erase = async function(request, reply, db, log, lib) {

	let { democracy_id, erase_field, erase_keys } = request

	const { lib_json, api_democracy } = lib

	try {
		// fetch democracy
		let dem = await api_democracy.democracy_read({ democracy_id })

		// calculate erased field
		let new_val = ''
		if(erase_field === 'name') {
			new_val = `Name erased for misconduct ${democracy_id}`
		} else if(erase_field === 'description') {
			new_val = `Description erased for misconduct`
		} else if(erase_field === 'conduct') {
			const lst = erase_keys.pop()
			new_val = lib_json.obj_del(dem.democracy_conduct, erase_keys, lst)
		} else if(erase_field === 'content') {
			const lst = erase_keys.pop()
			new_val = lib_json.obj_del(dem.democracy_content, erase_keys, lst)
		} else {
			log.warn(`Democracy/Erase: Failure: ${democracy_id} Error: Invalid erase field`)
			return reply.code(400).send(new Error(democracy_field))
		}

		// update democracy
		await db('democracy').update({
				['democracy_'+erase_field]: new_val
			})
			.where({
				id: democracy_id
			})

		// return results
		log.info(`Democracy/Erase: Success: ${democracy_id} ${erase_field}`)
		return reply.code(204).send()

	} catch(e) {
		
		if(e.message === democracy_dne) {
			log.warn( `Democracy/Erase: Failure: ${democracy_id} Error: Democracy does not exist`)
			return reply.code(400).send(new Error(democracy_dne))
		}

		log.error(`Democracy/Erase: Failure: ${democracy_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = democracy_erase
