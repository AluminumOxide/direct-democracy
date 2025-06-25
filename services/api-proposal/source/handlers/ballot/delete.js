const { ballot_dne, internal_error, ballot_closed, membership_dne } = require('../../errors.json')

const ballot_delete = async function(request, reply, db, log, lib) {

	const { ballot_id, proposal_id } = request
	const { api_proposal } = lib

	// check the ballot_id and proposal_id are valid
	let ballot_check
	try {
		// TODO: Remove proposal_id
		ballot_check = await api_proposal.ballot_read({ proposal_id, ballot_id })
	} catch (e) {
		if(e.message === ballot_dne) {
			log.warn(`Ballot/Delete: Failure: ${ballot_id} Error: Ballot does not exist`)
			return reply.code(400).send(new Error(ballot_dne))
		} else {
			log.error(`Ballot/Delete: Failure: ${ballot_id} Error: Ballot read ${e}`)
			return reply.code(500).send(new Error(internal_error))
		}
	}

	// check the proposal id is correct
	if(ballot_check.proposal_id !== proposal_id) {
		log.warn(`Ballot/Delete: Failure: ${ballot_id} Error: Invalid proposal id`)
		return reply.code(400).send(new Error(ballot_dne))
	}

	// check the ballot is modifiable
	if(!ballot_check.ballot_modifiable) {
		log.warn(`Ballot/Delete: Failure: ${ballot_id} Error: Ballot closed`)
		return reply.code(400).send(new Error(ballot_closed))
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
