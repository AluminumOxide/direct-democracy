const api_democracy_client = require('@aluminumoxide/direct-democracy-democracy-api-client')

const membership_create = async function(request, reply, db, log) {
	const { democracy_id, profile_id } = request

	// check democracy_id is valid
	try {
		const dem_check = await api_democracy_client.democracy_read({ democracy_id })
	}	catch (e) {
		log.error('Membership/Create: Failure(invalid democracy '+democracy_id+')')
		return reply.code(400).send()
	}

	// TODO - check profile_id is valid

	// make sure there is no pre-existing membership
	const check = await db('membership').select('id').where({ democracy_id, profile_id })
	if(!!check && check.length > 0) {
		log.error('Membership/Create: Failure')
		return reply.code(400).send('Membership/Create: Failure')
	}

	// create membership	
	const rows = await db('membership')
		.insert({ democracy_id, profile_id })
		.returning('*')

	const membership = {
    membership_id: rows[0].id,
    democracy_id: rows[0].democracy_id,
		profile_id: rows[0].profile_id,
		is_verified: rows[0].is_verified,
    date_created: rows[0].date_created,
    date_updated: rows[0].date_updated
	}

	if(!rows || rows.length < 1) {
		log.error('Membership/Create: Failure')
		return reply.code(400).send('Membership/Create: Failure')
  }

	// update democracy population
	try {
		const dem_pop = await api_democracy_client.democracy_population_increase({ democracy_id })
	} catch (e) {
		log.error('Membership/Democracy: Off by 1 '+democracy_id)
	}

	log.info('Membership/Create: Success('+membership.membership_id+')')
	return reply.code(200).send(membership)
}

module.exports = membership_create
