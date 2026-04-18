const { membership_unverified, membership_timeout, invalid_auth, internal_error } = require('../../errors.json')

const report_create = async function(request, reply, db, log, lib) {

  	const { democracy_id, misconduct_id, misconduct_description, target_type, target_id, target_text, target_keys, jwt } = request
	const { api_profile, api_proposal, api_membership } = lib

	try {
		// validate jwt
		const { profile_id } = await api_profile.sign_in_verify({ jwt })
		if(!profile_id) {
			// shouldn't happen
			log.error(`Report/Create: Failure: ${jwt} Error: JWT verify`)
			return reply.code(401).send(new Error(invalid_auth))
		}

		// get membership
		let membership = await api_membership.membership_list({
			filter: {
				democracy_id: { op: '=', val: democracy_id },
				profile_id: { op: '=', val: profile_id }
			}
		})

		// check membership
		if(membership.length === 0) {
			log.warn(`Report/Create: Failure: Error: Invalid Auth`)
			return reply.code(401).send(new Error(invalid_auth))
		}
		if(membership.length > 1) {
			// should never happen
			log.error(`Report/Create: Failure: Error: Duplicate Membership`)
			return reply.code(500).send(new Error(internal_error))
		}
		membership = membership[0]
		const membership_id = membership.membership_id

		// send to proposal service
		const prop = await api_proposal.proposal_create({
			democracy_id,
			membership_id,
			proposal_target: 'democracy_misconduct',
			proposal_name: misconduct_id,
			proposal_description: misconduct_description,
			proposal_changes: {
				[misconduct_id]: {
					[target_type]: {
						[target_id]: {
							_add: {
								[target_text]: !target_keys ? [] : target_keys
							}
						}
					}
				}
			}
		})

		// return results
		log.info(`Report/Create: Success: ${prop.proposal_id}`)
		return reply.code(201).send(prop)

	} catch(e) {

		// handle invalid jwt
		if(e.message === api_profile.errors.invalid_auth) {
			log.warn(`Report/Create: Failure: ${jwt} Error: Invalid token`)
			return reply.code(401).send(new Error(invalid_auth))
		}
		
		// handle invalid changes
		if(e.message === api_proposal.errors.changes_invalid) {
			log.warn(`Report/Create: Failure: Error: Changes invalid`)
			return reply.code(400).send(new Error(api_proposal.errors.changes_invalid))
		}

		// handle invalid democracy
		if(e.message === api_proposal.errors.democracy_invalid) {
			log.warn(`Report/Create: Failure: ${democracy_id} Error: Invalid democracy`)
			return reply.code(400).send(new Error(api_proposal.errors.democracy_invalid))
		}

		// handle all other errors
		log.error(`Report/Create: Failure: ${democracy_id} Error: ${e}`)
		return reply.code(500).send(new Error(api_proposal.errors.internal_error))
	}
}

module.exports = report_create
