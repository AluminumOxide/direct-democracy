const { internal_error, ballots_cast, proposal_dne, democracy_invalid, membership_invalid } = require('../../errors.json')

const proposal_delete = async function(request, reply, db, log) {
	const { proposal_id, membership_id, democracy_id } = request

	try {
		// check proposal_id
		const prop = await db('proposal').select('membership_id', 'democracy_id').where({ id: proposal_id })
		if(!prop || prop.length < 0) {
			log.warn(`Proposal/Delete: Failure: ${proposal_id} Error: Proposal does not exist`)
			return reply.code(400).send(new Error(proposal_dne))	
		}

		// check membership_id
		if(prop[0].membership_id !== membership_id) {
			log.warn(prop[0])
			log.warn(`Proposal/Delete: Failure: ${proposal_id},${membership_id} Error: Invalid membership`)
			return reply.code(400).send(new Error(membership_invalid))
		}

		// check democracy_id (optional)
		if(!!democracy_id && prop[0].democracy_id !== democracy_id) {
			log.warn(`Proposal/Delete: Failure: ${proposal_id},${democracy_id} Error: Invalid democracy`)
			return reply.code(400).send(new Error(democracy_invalid))
		}

		// check if ballots have been cast
		const counts = await db('ballot')
			.select([
				'is_approved'
			])
			.count('id', {as: 'cnt'})
			.groupBy('is_approved')
			.where({ 'proposal_id': proposal_id})

		// error if ballots have been cast
		if(!!counts && counts.length > 0) {
			log.warn(`Proposal/Delete: Failure: ${proposal_id} Error: Has cast ballots`)
			return reply.code(400).send(new Error(ballots_cast))
		}

		// delete the proposal
		await db('proposal').where({ id: proposal_id }).del()

	} catch (e) {

		// handle other errors
		log.error(`Proposal/Delete: Failure: ${proposal_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	// return results
	log.info(`Proposal/Delete: Success: ${proposal_id}`)
	return reply.code(204).send()
}

module.exports = proposal_delete
