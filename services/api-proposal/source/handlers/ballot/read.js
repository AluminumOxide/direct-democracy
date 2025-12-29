const { ballot_dne, internal_error } = require('../../errors.json')

const ballot_read = async function(request, reply, db, log, lib) {

	const { proposal_id, membership_id } = request

	try {
		// get ballot
		const rows = await db
		.select({
			'ballot_id': 'ballot.id',
			'proposal_id': db.raw("json_build_object('id',p.id,'name',p.name)"),
			'membership_id': 'ballot.membership_id',
			'ballot_approved': 'ballot.is_approved',
			'ballot_comments': 'ballot.comments',
			'ballot_modifiable': 'ballot.modifiable',
			'date_created': 'ballot.date_created',
			'date_updated': 'ballot.date_updated'
		})
		.fromRaw('ballot join proposal p on ballot.proposal_id = p.id')
		.where({
			'ballot.membership_id': membership_id,
			'ballot.proposal_id': proposal_id
		})

		// error if ballot dne
		if(!rows || rows.length < 1) {
			log.warn(`Ballot/Read: Failure: ${membership_id} Error: Ballot does not exist`)
			return reply.code(400).send(new Error(ballot_dne))
		}

		// return results
		log.info(`Ballot/Read: Success: ${membership_id}`)
		return reply.code(200).send(rows[0])

	} catch (e) {
		log.error(`Ballot/Read: Failure: ${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = ballot_read
