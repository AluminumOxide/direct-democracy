const { membership_dne, internal_error, profile_invalid } = require('../../errors.json')

const membership_delete = async function(request, reply, db, log, lib) {

	const { membership_id, profile_id } = request

	// check the membership exists
	let membership
	try {
		membership = await db('membership').select('democracy_id', 'profile_id').where({ id: membership_id })
		if(!membership || membership.length < 1) {	
			log.warn(`Membership/Delete: Failure: ${membership_id} Error: Membership does not exist`)
			return reply.code(400).send(new Error(membership_dne))
		}
	} catch(e) {
		log.error(`Membership/Delete: Failure: ${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	// check profile_id
	membership = membership[0]
	if(membership.profile_id !== profile_id) {
		log.warn(`Membership/Delete: Failure: ${membership_id} Error: Invalid profile`)
		return reply.code(400).send(new Error(profile_invalid))
	}

	// delete membership
	try {	
		await db('membership').where({ id: membership_id }).del()
	} catch (e) {
		log.error(`Membership/Delete: Failure: ${membership_id} Error: membership deletion ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	log.info(`Membership/Delete: Success: ${membership_id}`)
	return reply.code(204).send()
}

module.exports = membership_delete
