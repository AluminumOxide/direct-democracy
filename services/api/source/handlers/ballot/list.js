const { internal_error } = require('../../errors.json')

const ballot_list = async function(request, reply, db, log, lib) {

	const { proposal_id, ballot_approved } = request
	const { api_proposal } = lib

	try {
		// fetch ballots
		let balls = await api_proposal.ballot_list({
			proposal_id,
			filter: {
				ballot_approved: {
					op: '=',
					val: ballot_approved === 'yes'
				},
				ballot_comments: {
					op: '!=',
					val: 'null'
				}
			}
		})

		// return only the comments
		log.info(`Ballot/List: Success`)
		return reply.code(200).send(!balls ? [] : balls.map(b => ({
			id: b.ballot_id,
			comments: b.ballot_comments
		})))

	// handle any errors
	} catch(e) {
		log.error(`Ballot/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = ballot_list
