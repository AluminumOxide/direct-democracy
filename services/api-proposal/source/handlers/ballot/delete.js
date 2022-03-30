const api_proposal_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
const { ballot_dne, internal_error, ballot_closed, membership_dne } = require('../../errors.json')

const ballot_delete = async function(request, reply, db, log) {
	const { ballot_id, proposal_id, membership_id } = request

	// check the ballot_id and proposal_id are valid
	let ballot_check
	try {
		ballot_check = await api_proposal_client.ballot_read({ proposal_id, ballot_id })
	} catch (e) {
		if(e.message === ballot_dne) {
			log.warn(`Ballot/Delete: Failure: ${ballot_id} Error: Ballot does not exist`)
			return reply.code(400).send(new Error(ballot_dne))
		} else {
			log.error(`Ballot/Delete: Failure: ${ballot_id} Error: Ballot read ${e}`)
			return reply.code(500).send(new Error(internal_error))
		}
	}

	// check the ballot is modifiable
	if(!ballot_check.ballot_modifiable) {
		log.warn(`Ballot/Delete: Failure: ${ballot_id} Error: Ballot closed`)
		return reply.code(400).send(new Error(ballot_closed))
	}

	// check membership_id and ballot_id match
	if(ballot_check.membership_id !== membership_id) {
		log.warn(`Ballot/Delete: Failure: ${membership_id} Error: Membership does not exist`)
		return reply.code(400).send(new Error(membership_dne))
	}

	// delete ballot
	try {
		await db('ballot')
		.where({
			'id': ballot_id,
			'proposal_id': proposal_id
		})
		.del()

	} catch (e) {
		log.error(`Ballot/Delete: Failure: ${ballot_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	log.info(`Ballot/Delete: Success: ${ballot_id}`)
	return reply.code(204).send()
}

module.exports = ballot_delete
