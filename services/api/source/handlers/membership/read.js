const mem_client = new (require('@AluminumOxide/direct-democracy-membership-api-client'))()
const auth = require('../../helpers/auth')
const { invalid_auth } = require('../../errors.json')

const membership_read = async function(request, reply, db, log) {
	let { membership_id } = request

	try {
		// get auth info
		const profile_id = await auth.get_profile_id(request, log)

		// fetch from membership service
		const mem = await mem_client.membership_read({ membership_id })

		// handle invalid profile_id
		if(mem.profile_id !== profile_id) {
			log.warn(`Membership/Read: Failure: ${membership_id} Error: Invalid auth`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// return results
		log.info(`Membership/Read: Success: ${membership_id}`)
		return reply.code(200).send(mem)

	} catch(e) {

		// handle invalid membership_id
		if(e.message === mem_client.errors.membership_dne) {
			log.warn(`Membership/Read: Failure: ${membership_id} Error: Invalid membership_id`)
			return reply.code(400).send(new Error(mem_client.errors.membership_dne))
		}

		// handle all other errors
		log.error(`Membership/Read: Failure: ${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(mem_client.errors.internal_error))
	}
}

module.exports = membership_read
