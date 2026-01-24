const { invalid_auth, internal_error } = require('../../errors')

const membership_verify = async function(request, reply, db, log, lib) {

	const { jwt, membership_id, description } = request
	const { api_profile, api_membership, api_proposal } = lib

	try {
		// verify auth
		const { profile_id } = await api_profile.sign_in_verify({ jwt })

		// get membership
		const member = await api_membership.membership_read({ membership_id })

		// check jwt is for membership
		if(profile_id !== member.profile_id) {
			log.warn(`Membership/Verify: Failure: ${profile_id} Error: Trying to modify ${membership_id}`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// check membership is unverified
		if(!!member.is_verified || !!member.is_verifying) {
			log.warn(`Membership/Verify: Failure: ${membership_id} Error: Invalid status`)
			return reply.code(400).send(new Error(api_membership.errors.membership_verified))
		}

		// create proposal
		const prop = await api_proposal.proposal_create({
			membership_id,
			democracy_id: member.democracy_id,
			proposal_name: membership_id,
			proposal_description: description,
			proposal_target: 'democracy_members',
			proposal_changes: {[membership_id]: {
				_update:{
					is_verified: true
				}
			}}
		})

		// return proposal
		log.info(`Membership/Verify: Success! ${membership_id}`)
		return reply.code(200).send(prop)

	} catch(e) {

		// handle invalid auth
		if(e.message === api_profile.errors.invalid_auth) {
			log.warn(`Membership/Verify: Failure: ${jwt} Error: Invalid token`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// handle invalid membership_id
		if(e.message === api_membership.errors.membership_dne) {
			log.warn(`Membership/Verify: Failure: ${membership_id} Error: Invalid membership`)
			return reply.code(400).send(new Error(api_membership.errors.membership_dne))
		}

		// handle all other errors
		log.error(`Membership/Verify: Failure: ${membership_id} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = membership_verify
