const { proposal_dne, internal_error } = require('../../errors.json')

const proposal_read = async function(request, reply, db, log, lib) {

	const { proposal_id } = request

	try {
		// get proposal
		const rows = await db('proposal')
		.select({
			'proposal_id': 'id',
			'democracy_id': 'democracy_id',
			'membership_id': 'membership_id',
			'proposal_name': 'name',
			'proposal_description': 'description',
			'proposal_target': 'target',
			'proposal_changes': 'changes',
			'proposal_votable': 'votable',
			'proposal_passed': 'passed',
			'date_created': 'date_created',
			'date_updated': 'date_updated'
		})
		.where({ id: proposal_id })

		// error if proposal dne
		if(!rows || rows.length < 1) {
			log.warn( `Proposal/Read: Failure: ${proposal_id} Error: Proposal does not exist`)
			return reply.code(400).send(new Error(proposal_dne))
		}
		let proposal = rows[0]

		// count ballots
		const counts = await db('ballot')
		.select([
			'is_approved',
			'is_verified'
		])
		.count('id', {as: 'cnt'})
		.groupBy(['is_approved', 'is_verified'])
		.orderBy(['is_verified', 'is_approved'])
		.where({ 'proposal_id': proposal_id})
		let cnts = {}
		for(i of counts) {
			cnts[Boolean(i.is_verified).toString()+Boolean(i.is_approved).toString()] = parseInt(i.cnt)
		}
		proposal.proposal_votes = { 
			'unverified': {
				'no': cnts['falsefalse'] ? cnts['falsefalse'] : 0,
				'yes': cnts['falsetrue'] ? cnts['falsetrue'] : 0
			},
			'verified': {
				'no': cnts['truefalse'] ? cnts['truefalse'] : 0,
				'yes': cnts['truetrue'] ? cnts['truetrue'] : 0
			}
		}

		// return results
		log.info(`Proposal/Read: Success: ${proposal_id}`)
		return reply.code(200).send(proposal)

	} catch(e) {
		log.error(`Proposal/Read: Failure: ${proposal_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = proposal_read
