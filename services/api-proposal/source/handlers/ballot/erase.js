const { ballot_dne, internal_error } = require('../../errors.json')

const ballot_erase = async function(request, reply, db, log, lib) {

	const { ballot_id } = request

	try {
		// update ballot
		const ball = await db('ballot')
			.update({ comments: '' })
			.where({ id: ballot_id })
			.returning('*')

		// handle ballot dne
		if(!ball || ball.length < 1) {
			log.warn(`Ballot/Erase: Failure: ${ballot_id} Error: Ballot DNE`)
			return reply.code(400).send(new Error(ballot_dne))
		}

		// return results
		log.info(`Ballot/Erase: Success: ${ballot_id}`)
		return reply.code(204).send()

	} catch(e) {
		log.error(`Ballot/Erase: Failure: ${ballot_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = ballot_erase
