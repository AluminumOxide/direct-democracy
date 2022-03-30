const { membership_dne, internal_error } = require('../../errors.json')
const api_democracy_client = require('@aluminumoxide/direct-democracy-democracy-api-client')

const membership_delete = async function(request, reply, db, log) {
	const { membership_id } = request

	// check the membership exists
	let membership
	try {
		membership = await db('membership').select('democracy_id').where({ id: membership_id })
		if(!membership || membership.length < 1) {	
			log.warn(`Membership/Delete: Failure: ${membership_id} Error: Membership does not exist`)
			return reply.code(400).send(new Error(membership_dne))
		}
	} catch(e) {
		log.error(`Membership/Delete: Failure: ${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	// update democracy population
	try {
		await api_democracy_client.democracy_population_decrease({ democracy_id: membership[0].democracy_id })
	} catch (e) {
		if(e.message === api_democracy_client.errors.democracy_dne) {
			// if the democracy DNE, we definately want to delete this membership!
			log.warn(`Membership/Delete: Failure: ${membership_id} Error: Democracy does not exist`)
		} else {
			log.error(`Membership/Delete: Failure: ${membership_id} Error: democracy population decrease ${e}`)
			return reply.code(500).send(new Error(internal_error))
		}
	}

	// delete membership
	try {	
		await db('membership').where({ id: membership_id }).del()
	} catch (e) {
		log.error(`Membership/Delete: Failure: ${membership_id} Error: membership deletion ${e}`)
		try {
			await api_democracy_client.democracy_population_increase({ democracy_id: membership.democracy_id })
		} catch(e) {
			log.error(`Membership/Delete: Failure: ${membership_id} Error: !!!OFF BY 1!!! population increase after failed membership deletion ${e}`)
		}
		return reply.code(500).send(new Error(internal_error))
	}

	log.info(`Membership/Delete: Success: ${membership_id}`)
	return reply.code(204).send()
}

module.exports = membership_delete
