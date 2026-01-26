const { democracy_dne, internal_error, membership_dne, membership_exist } = require('../../errors.json')

const democracy_members = async function(request, reply, db, log, lib) {

	const { democracy_id, members } = request
	const { api_democracy } = lib

	try {
		// check we were given memberships
		if(members.length === 0) {
			log.warn(`Membership/Democracy: Failure: ${democracy_id} Error: No members`)
			return reply.code(400).send(new Error(membership_dne))
		}

		// check democracy_id is valid
		await api_democracy.democracy_read({ democracy_id })
		
		// check democracy has no memberships
		const mems = await db('membership').select('id').where({ democracy_id })
		if(mems.length !== 0) {
			log.warn(`Membership/Democracy: Failure: ${democracy_id} Error: Democracy already has memberships`)
			return reply.code(400).send(new Error(democracy_dne))
		}

		// get profile_ids
		const profiles = await db('membership')
			.select('profile_id')
			.whereIn('id', members)

		// handle profile lookup failure
		if(!profiles || profiles.length < members.length) {
			log.error(`Membership/Democracy: Failure: ${democracy_id} Error: profile lookup failure ${members}`)
			return reply.code(500).send(new Error(internal_error))
		}

		// create memberships
		const rows = await db('membership')
			.insert(profiles.map(p => ({ democracy_id, profile_id: p.profile_id })))
			.returning('id')

		// handle membership creation failure
		if(!rows || rows.length < members.length) {
			log.error(`Membership/Democracy: Failure: ${democracy_id} Error: membership insertion ${profiles.map(p => p.profile_id)}`)
			return reply.code(500).send(new Error(internal_error))
		}

		// return success
		log.info(`Membership/Democracy: Success: ${democracy_id}`)
		return reply.code(201).send()
	

	} catch(e) {
	
		// handle democracy dne errors
		if(e.message === democracy_dne) {
			log.warn(`Membership/Democracy: Failure: ${democracy_id} Error: Democracy does not exist`)
			return reply.code(400).send(new Error(democracy_dne))
		}
	
		// handle all other errors
		log.error(`Membership/Democracy: Failure: ${democracy_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = democracy_members
