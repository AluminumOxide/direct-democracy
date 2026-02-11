const { proposal_dne, target_invalid, internal_error } = require('../../errors.json')

const proposal_erase = async function(request, reply, db, log, lib) {

	let { proposal_id, erase_field, erase_keys } = request
	const { api_proposal } = lib

	try {
		// verify proposal id
		await api_proposal.proposal_read({ proposal_id })

		// calculate erased field
		let new_val = ''
		if(erase_field === 'name') {
			new_val = `Name erased for misconduct ${proposal_id}`
		} else if(erase_field === 'description') {
			new_val = `Description erased for misconduct`
		} else if(erase_field === 'changes') {
			new_val = {}
		} else {
			log.warn(`Proposal/Erase: Failure: ${proposal_id} Error: Invalid erase field`)
			return reply.code(400).send(new Error(target_invalid))
		}

		// update proposal
		await db('proposal').update({
				[erase_field]: new_val
			})
			.where({
				id: proposal_id
			})

		// return results
		log.info(`Proposal/Erase: Success: ${proposal_id} ${erase_field}`)
		return reply.code(204).send()

	} catch(e) {

		// handle proposal dne
		if(e.message === proposal_dne) {
			log.warn( `Proposal/Erase: Failure: ${proposal_id} Error: Proposal does not exist`)
			return reply.code(400).send(new Error(proposal_dne))
		}

		// handle all other errors
		log.error(`Proposal/Erase: Failure: ${proposal_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = proposal_erase
