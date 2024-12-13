const prop_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
const auth = require('../../helpers/auth')
const { invalid_auth } = require('../../errors.json')

const ballot_delete = async function(request, reply, db, log) {
	const { ballot_id } = request

	try {
		// get ballot
		const ballot = await prop_client.ballot_read({ ballot_id })

		// get membership id
		const profile_id = await auth.get_profile_id(request, log)
		const membership_id = await auth.get_membership_id(profile_id, ballot.democracy_id)

	 	// check membership_id and ballot_id match
		if(ballot.membership_id !== membership_id) {
			log.warn(`Ballot/Delete: Failure: Error: Invalid auth`)
			return reply.code(401).send(new Error(invalid_auth))
	  	}

		// delete ballot 
		await prop_client.ballot_delete({ ballot_id, proposal_id: ballot.proposal_id })

		// return results
		log.info(`Ballot/Delete: Success: `)
		return reply.code(204).send()

	} catch(e) {

		// handle invalid ballot_id
		if(e.message === prop_client.errors.ballot_dne) {
			log.warn(`Ballot/Delete: Failure:  Error: Invalid ballot_id`)
			return reply.code(400).send(new Error(prop_client.errors.ballot_dne))
		}

		// handle invalid proposal
		if(e.message === prop_client.errors.proposal_dne) {
			log.warn(`Ballot/Delete: Failure:  Error: Invalid proposal`)
			return reply.code(400).send(new Error(prop_client.errors.proposal_dne))
		}

		// handle invalid membership_id
		if(e.message === prop_client.errors.membership_dne) {
			log.warn(`Ballot/Delete: Failure:  Error: Invalid auth`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// handle closed ballot
		if(e.message === prop_client.errors.ballot_closed) {
			log.warn(`Ballot/Delete: Failure:  Error: Ballot closed`)
			return reply.code(400).send(new Error(prop_client.errors.ballot_closed))
		}

		// handle all other errors
		log.error(`Ballot/Delete: Failure:  Error: ${e}`)
		return reply.code(500).send(new Error(prop_client.errors.internal_error))
	}
}

module.exports = ballot_delete
