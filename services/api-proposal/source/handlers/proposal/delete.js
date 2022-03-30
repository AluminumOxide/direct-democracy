const { internal_error, ballots_cast } = require('../../errors.json')

const proposal_delete = async function(request, reply, db, log) {
	const { proposal_id } = request

	try {
		const counts = await db('ballot')
		.select([
			'is_approved'
		])
		.count('id', {as: 'cnt'})
		.groupBy('is_approved')
		.where({ 'proposal_id': proposal_id})

		if(!!counts && counts.length > 0) {
			log.warn(`Proposal/Delete: Failure: ${proposal_id} Error: Has cast ballots`)
			return reply.code(400).send(new Error(ballots_cast))
		}

		await db('proposal').where({ id: proposal_id }).del()

	} catch (e) {
		log.error(`Proposal/Delete: Failure: ${proposal_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	log.info(`Proposal/Delete: Success: ${proposal_id}`)
	return reply.code(204).send()
}

module.exports = proposal_delete
