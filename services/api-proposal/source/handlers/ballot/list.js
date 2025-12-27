const { internal_error } = require('../../errors.json')

const ballot_list = async function(request, reply, db, log, lib) {

	let { limit, last, sort, order, filter={}, proposal_id } = request

	if(!!proposal_id) {
		filter['proposal_id_id'] = { op: '=', val: proposal_id }
	}
	if(!!filter['proposal_id']) {
		filter['proposal_id_id'] = filter['proposal_id']
		delete filter['proposal_id']
	}

	try {
		// list ballots
		const rows = await db
			.pageQuery(limit, last, sort, order, filter,
				db.select({ 
					'ballot_id': 'b.id',
					'membership_id': 'b.membership_id',
					'proposal_id_id': 'p.id',
					'proposal_id': db.raw("json_build_object('id',p.id,'name',p.name)"),
					'ballot_approved': 'b.is_approved',
					'ballot_comments': 'b.comments',
					'ballot_modifiable': 'b.modifiable',
					'ballot_verified': 'b.is_verified',
					'date_created': 'b.date_created',
					'date_updated': 'b.date_updated'
				})
				.fromRaw('ballot b join proposal p on b.proposal_id = p.id')
			)	

		log.info('Ballot/List: Success')
		return reply.code(200).send(rows)

	} catch(e) {
		log.error(`Ballot/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = ballot_list
