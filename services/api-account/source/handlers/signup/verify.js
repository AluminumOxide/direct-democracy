const { account_dne, token_dne, internal_error } = require('../../errors.json')

const sign_up_verify = async function(request, reply, db, log, lib) {

	const { email_token, account_token, encrypted_profile } = request

	try {
		// get account for email token
		const account_query = await db('account').select('id').where({ email_token })

		// handle missing account
		if(!account_query || account_query.length < 1) {
			log.warn(`Account/Signup/Verify: Failure: ${email_token} Error: Account DNE`)
			return reply.code(400).send(new Error(account_dne))

		// handle duplicate accounts - should never happen
		} else if(account_query.length > 1) {
			log.error(`Account/Signup/Verify: Failure: ${email_token} Error: Double Token!`)
			return reply.code(500).send(new Error(internal_error))
		}
		const id = account_query[0].id

		// verify and delete account token
		const delete_query = await db('token').where({ bucket: 'account', token: account_token }).del(['token'])

		// handle missing token
		if(!delete_query || delete_query.length < 1) {
			log.warn(`Account/Signup/Verify: Failure: ${account_token} Error: Token DNE`)
			return reply.code(400).send(new Error(token_dne))

		// handle duplicate token - should never happen
		} else if(delete_query.length > 1) {
			log.error(`Account/Signup/Verify: Failure: ${account_token} Error: Double Token!`)
			return reply.code(500).send(new Error(internal_error))
		}

		// save encrypted profile and delete email token
		await db('account').where({ id }).update({
			encrypted_profile,
			is_verified: true,
			email_token: ''
		})

		// return success
		log.info(`Account/Signup/Verify: Success: ${email_token}`)
		return reply.code(200).send()
	
	// handle errors
	} catch(e) {
		log.error(`Account/Signup/Verify: Failure: ${email_token} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = sign_up_verify
