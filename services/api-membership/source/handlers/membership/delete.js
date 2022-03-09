const api_democracy_client = require('@aluminumoxide/direct-democracy-democracy-api-client')

const membership_delete = async function(request, reply, db, log) {
	const { membership_id } = request

	// check the membership exists
	const check = await db('membership').select('democracy_id').where({ id: membership_id })
	if(!check || check.length < 1) {	
		log.error('Membership/Delete: Failure('+membership_id+')')
		return reply.code(400).send()
	}

	// delete membership
	try {	
		const rows = await db('membership').where({ id: membership_id }).del()
	} catch (e) {
		log.error('Membership/Delete: Failure('+membership_id+')')
		return reply.code(400).send()
	}

  // update democracy population
  try {
    const dem_pop = await api_democracy_client.democracy_population_decrease({ democracy_id: check[0].democracy_id })
  } catch (e) {
		console.log(e)
    log.error('Membership/Democracy: Off by -1 '+check[0].democracy_id)
  }

	log.info('Membership/Delete: Success('+membership_id+')')
	return reply.code(204).send()
}

module.exports = membership_delete
