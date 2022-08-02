const { ballot_dne, internal_error } = require('../../errors.json')

const ballot_read = async function(request, reply, db, log) {
	const { ballot_id } = request

	try {
		// get ballot
		const rows = await db('ballot')
		.select({
			'ballot_id': 'id',
			'proposal_id': 'proposal_id',
			'membership_id': 'membership_id',
			'ballot_approved': 'is_approved',
			'ballot_comments': 'comments',
			'ballot_modifiable': 'modifiable',
			'date_created': 'date_created',
			'date_updated': 'date_updated'
		})
		.where({
			'id': ballot_id
		})

		// error if ballot dne
		if(!rows || rows.length < 1) {
			log.warn(`Ballot/Read: Failure: ${ballot_id} Error: Ballot does not exist`)
			return reply.code(400).send(new Error(ballot_dne))
		}

		// return results
		log.info(`Ballot/Read: Success: ${ballot_id}`)
		return reply.code(200).send(rows[0])

	} catch (e) {
		log.error(`Ballot/Read: Failure: ${ballot_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = ballot_read
