
const proposal_delete = async function(request, reply, db, log) {
	const { proposal_id } = request

	try {
		const rows = await db('proposal').where({ id: proposal_id }).del()
	} catch (e) {
		log.error('Proposal/Delete: Failure('+proposal_id+')')
		return reply.code(400).send()
	}

	log.info('Proposal/Delete: Success('+proposal_id+')')
	return reply.code(204).send()
}

module.exports = proposal_delete
