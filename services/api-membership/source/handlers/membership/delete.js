const { membership_dne, internal_error, profile_invalid } = require('../../errors.json')

const membership_delete = async function(request, reply, db, log, lib) {

	const { membership_id, profile_id } = request
	const { api_proposal } = lib

	// check the membership exists
	let membership
	try {
		membership = await db('membership').select('democracy_id', 'profile_id','is_verifying','verify_proposal').where({ id: membership_id, is_deleted: false })
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

	// close any verifying proposals
	if(!!membership.is_verifying) {
		try {
			await api_proposal.proposal_close({
				proposal_id: membership.verify_proposal,
				passed: false
			})
		} catch(e) {
			log.error(`Membership/Delete: Failure: ${membership_id} Error: Membership proposal deletion failed ${e}`)
			return reply.code(500).send(new Error(internal_error))
		}
	}

	// delete membership
	try {	
		const rows = await db('membership').where({ id: membership_id }).update({ is_deleted: true }).returning('id')
		if(!rows || rows.length !== 1) {
			log.error(`Membership/Delete: Failure: ${membership_id} Error: Membership deletion failed`)
			return reply.code(500).send(new Error(internal_error))
		}
	} catch (e) {
		log.error(`Membership/Delete: Failure: ${membership_id} Error: membership deletion ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	log.info(`Membership/Delete: Success: ${membership_id}`)
	return reply.code(204).send()
}

module.exports = membership_delete
