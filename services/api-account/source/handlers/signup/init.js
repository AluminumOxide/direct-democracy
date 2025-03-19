const { email_exist, internal_error } = require('../../errors.json')

const sign_up_init = async function(request, reply, db, log) {
	const { email, zkpp, salt, encrypted_question } = request

	try {
		// pick an email token
		const token_query = await db('token').where({
				bucket: 'email'
			}).orderByRaw('random()').limit(1).del(['token'])

		// handle empty email bucket
		if(!token_query || token_query.length < 1) {
			log.error(`Account/Signup/Init: Failure: ${email} Error: No email token!`)
			return reply.code(500).send(new Error(internal_error))
		}
		const email_token = token_query[0].token
		console.log("---- EMAIL ----", email_token) // TODO: actually email token

		// create account
		const rows = await db('account').insert({
			email,
			email_token,
			encrypted_question,
			auth_zkpp: zkpp,
			auth_salt: salt,
		}).returning('*')

		// handle account creation failure
		if(!rows || rows.length < 1) {
			log.error(`Account/Signup/Init: Failure: ${email} Error: account insertion`)
			return reply.code(500).send(new Error(internal_error))
		}

		// return success
		log.info(`Account/Signup/Init: Success: ${email}`)
		return reply.code(200).send()

	} catch(e) {

		// handle duplicate emails
		if(/duplicate key value violates unique constraint/.test(e.message)) {
			log.warn(`Account/Signup/Init: Failure: ${email} Error: Email not unique`)
			return reply.code(400).send(new Error(email_exist))
		}

		// handle any other errors
		log.error(`Account/Signup/Init: Failure: ${email} Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = sign_up_init
