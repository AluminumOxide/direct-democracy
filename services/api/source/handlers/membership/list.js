const { invalid_auth } = require('../../errors')

const membership_list = async function(request, reply, db, log, lib) {

	let { limit, last, sort, order, filter={}, jwt } = request
	const { api_profile, api_membership, api_democracy } = lib

	try {
		// get profile_id
		const { profile_id } = await api_profile.sign_in_verify({ jwt })
		if(!profile_id) {
			// shouldn't happen
			log.error(`Membership/List: Failure: ${jwt} Error: JWT verify`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// set up filter
		filter['profile_id'] = { op: '=', val: profile_id }

		// fetch from membership service
		const mems = await api_membership.membership_list({ limit, last, sort, order, filter })

		// fetch democracy names
		const dems = (await api_democracy.democracy_list({
			filter: {
				democracy_id:{
					op: 'IN',
					val: Array.from(new Set(mems.map(k => k.democracy_id)))
				}
			}
		})).reduce((a,v) => Object.assign(a, {
			[v.democracy_id]:{id:v.democracy_id,name:v.democracy_name}
		}), {})

		// update membership democracy id/names
		mems.forEach((m,i) => {
			mems[i].democracy_id = dems[m.democracy_id]
		})

		// return results
		log.info(`Membership/List: Success: ${profile_id}`)
		return reply.code(200).send(mems)

	} catch(e) {

		// handle invalid jwt
		if(e.message === api_profile.errors.invalid_auth) {
			log.warn(`Membership/List: Failure: ${jwt} Error: Invalid token`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// handle all other errors
		log.error(`Membership/List: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(api_membership.errors.internal_error))
	}
}

module.exports = membership_list
