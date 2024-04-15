const prop_client = require('@AluminumOxide/direct-democracy-proposal-api-client')
const auth = require('../../helpers/auth')

const ballot_read = async function(request, reply, db, log) {
	const { proposal_id, democracy_id } = request

	try {
		// get profile_id
		const profile_id = await auth.get_profile_id(request, log)

		// get membership_id
		const membership_id = await auth.get_membership_id(profile_id, democracy_id)

		// search ballots
		const ballots = await prop_client.ballot_list({ filter:{ membership_id: { op: '=', val: membership_id }, proposal_id:{ op: '=', val: proposal_id } } })		
		if(ballots.length < 1) {
			log.warn(`Ballot/Read: Failure: Error: `)
			return reply.code(400).send(new Error(prop_client.errors.ballot_dne))
		}

		// fetch ballot data
		const ballot = await prop_client.ballot_read({ ballot_id: ballots[0].ballot_id  })

		// return results
		log.info(`Ballot/Read: Success: ${ballot.ballot_id}`)
		return reply.code(200).send(ballot)

	} catch(e) {

		// handle invalid ballot_id
		if(e.message === prop_client.errors.ballot_dne) {
			log.warn(`Ballot/Read: Failure: ${ballot_id} Error: Invalid ballot_id`)
			return reply.code(400).send(new Error(prop_client.errors.ballot_dne))
		}

		// handle invalid proposal
		if(e.message === prop_client.errors.proposal_dne) {
			log.warn(`Ballot/Read: Failure: ${ballot_id} Error: Invalid proposal`)
			return reply.code(400).send(new Error(prop_client.errors.proposal_dne))
		}

		// handle all other errors
		log.error(`Ballot/Read: Failure: ${ballot_id} Error: ${e}`)
		return reply.code(500).send(new Error(prop_client.errors.internal_error))
	}
}

module.exports = ballot_read
