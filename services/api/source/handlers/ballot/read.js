const prop_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
const auth = require('../../helpers/auth')
const { invalid_auth } = require('../../errors.json')

const ballot_read = async function(request, reply, db, log) {
	const { ballot_id } = request

	try {
		// fetch ballot
		const ballot = await prop_client.ballot_read({ ballot_id })

		// get membership ids
		const profile_id = await auth.get_profile_id(request, log)
		const memberships = await auth.get_membership_ids(profile_id)
		const membership_ids = memberships.map((x) => x.membership_id)

		// check membership id
		if(membership_ids.indexOf(ballot.membership_id) < 0) {
			log.warn(`Ballot/Read: Failure: Error: Invalid auth`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// return results
		log.info(`Ballot/Read: Success: ${ballot.ballot_id}`)
		return reply.code(200).send(ballot)

	} catch(e) {

		// handle invalid ballot_id
		if(e.message === prop_client.errors.ballot_dne) {
			log.warn(`Ballot/Read: Failure: Error: Invalid ballot_id`)
			return reply.code(400).send(new Error(prop_client.errors.ballot_dne))
		}

		// handle invalid proposal
		if(e.message === prop_client.errors.proposal_dne) {
			log.warn(`Ballot/Read: Failure: Error: Invalid proposal`)
			return reply.code(400).send(new Error(prop_client.errors.proposal_dne))
		}

		// handle all other errors
		log.error(`Ballot/Read: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(prop_client.errors.internal_error))
	}
}

module.exports = ballot_read
