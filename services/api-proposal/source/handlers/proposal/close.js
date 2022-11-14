const { proposal_dne, internal_error, voting_closed } = require('../../errors.json')

const proposal_close = async function(request, reply, db, log) {
	const { proposal_id, passed } = request
	try {
		// get proposal
		const rows = await db('proposal')
		.select({
			'proposal_votable': 'votable'
		})
		.where({ id: proposal_id })

		// error if proposal dne
		if(!rows || rows.length < 1) {
			log.warn( `Proposal/Close: Failure: ${proposal_id} Error: Proposal does not exist`)
			return reply.code(400).send(new Error(proposal_dne))
		}

		// check it's not already closed
		let proposal = rows[0]
		if(!proposal.proposal_votable) {
			log.warn(`Proposal/Close: Failure: ${proposal_id} Error: Proposal already closed`)
			return reply.code(400).send(new Error(voting_closed))
		}

		// close the proposal
		const res = await db('proposal').update({ votable: false, passed }).where({ id: proposal_id }).returning('*')
		if(!res || res.length < 1) {
			log.error(`Proposal/Close: Failure: ${proposal_id} Error: Proposal failed to close`)
			return reply.code(500).send(new Error(internal_error))
		}

		// return results
		log.info(`Proposal/Close: Success: ${proposal_id}`)
		return reply.code(200).send()

	} catch(e) {
		log.error(`Proposal/Close: Failure: ${proposal_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = proposal_close
