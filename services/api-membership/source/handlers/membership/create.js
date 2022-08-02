const { democracy_dne, internal_error, membership_exist } = require('../../errors.json')
const api_democracy_client = new (require('@aluminumoxide/direct-democracy-democracy-api-client'))()

const membership_create = async function(request, reply, db, log) {
	const { democracy_id, profile_id } = request

	// check democracy_id is valid
	try {
		await api_democracy_client.democracy_read({ democracy_id })
	} catch (e) {
		if(e.message === api_democracy_client.errors.democracy_dne) {
			log.warn(`Membership/Create: Failure: ${democracy_id},${profile_id} Error: Democracy does not exist`)
			return reply.code(400).send(new Error(democracy_dne))
		}
		log.error(`Membership/Create: Failure: ${democracy_id},${profile_id} Error: fetching democracy ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	// TODO - check profile_id is valid

	// make sure there is no pre-existing membership
	try {
		const check = await db('membership').select('id').where({ democracy_id, profile_id })
		if(!!check && check.length > 0) {
			log.warn(`Membership/Create: Failure: ${democracy_id},${profile_id} Error: Membership already exists`)
			return reply.code(400).send(new Error(membership_exist))
		}
	} catch(e) {
		log.error(`Membership/Create: Failure: ${democracy_id},${profile_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}

	// create membership
	try {
		const rows = await db('membership')
			.insert({ democracy_id, profile_id })
			.returning('*')

		// handle membership creation failure
		if(!rows || rows.length < 1) {
			log.error(`Membership/Create: Failure: ${democracy_id},${profile_id} Error: membership insertion`)
			return reply.code(500).send(new Error(internal_error))
		}

		// return new membership
		const membership = {
			membership_id: rows[0].id,
			democracy_id: rows[0].democracy_id,
			profile_id: rows[0].profile_id,
			is_verified: rows[0].is_verified,
			date_created: rows[0].date_created,
			date_updated: rows[0].date_updated
		}
		log.info(`Membership/Create: Success: ${membership.membership_id}`)
		return reply.code(200).send(membership)
	} catch(e) {
		log.error(`Membership/Create: Failure: ${democracy_id},${profile_id} Error: create membership ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = membership_create
