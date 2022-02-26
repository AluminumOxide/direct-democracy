
const ballot_delete = async function(request, reply, db, log) {
	const { ballot_id, proposal_id } = request

	try {
		const rows = await db('ballot')
		.where({
			'id': ballot_id,
			'proposal_id': proposal_id
		})
		.del()
	} catch (e) {
		log.error('Ballot/Delete: Failure('+ballot_id+')')
		return reply.code(400).send()
	}

	log.info('Ballot/Delete: Success('+ballot_id+')')
	return reply.code(204).send()
}

module.exports = ballot_delete
