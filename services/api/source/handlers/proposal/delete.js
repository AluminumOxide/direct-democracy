const prop_client = new (require('@aluminumoxide/direct-democracy-proposal-api-client'))()
const auth = require('../../helpers/auth')

const proposal_delete = async function(request, reply, db, log) {
 	const { democracy_id, proposal_id } = request

	try {
		// get proposal	
		const prop = await prop_client.proposal_read({ proposal_id })

		// get auth info
		const profile_id = await auth.get_profile_id(request, log)
		const membership_id = await auth.get_membership_id(profile_id, prop.democracy_id, log)

		// check membership_id
		if(prop.membership_id !== membership_id) {
		        log.warn(`Proposal/Delete: Failure: ${proposal_id},${membership_id} Error: Invalid membership`)
		        return reply.code(400).send(new Error(prop_client.errors.membership_invalid))
		}
  
		// check democracy_id (optional)
		if(prop.democracy_id !== democracy_id) {
			  log.warn(`Proposal/Delete: Failure: ${proposal_id},${democracy_id} Error: Invalid democracy`)
			  return reply.code(400).send(new Error(prop_client.errors.democracy_invalid))
		}

		// delete from proposal service
		await prop_client.proposal_delete({ proposal_id })

		// return results
		log.info(`Proposal/Delete: Success: ${proposal_id}`)
		return reply.code(204).send()

	} catch(e) {

		// handle invalid proposal_id
		if(e.messge === prop_client.errors.proposal_dne) {
			log.warn(`Proposal/Delete: Failure: Error: Proposal does not exist`)
			return reply.code(400).send(new Error(prop_client.errors.proposal_dne))
		}

		// handle all other errors
		log.error(`Proposal/Delete: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(prop_client.errors.internal_error))
	}
}

module.exports = proposal_delete
