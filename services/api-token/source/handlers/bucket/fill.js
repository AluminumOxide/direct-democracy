const { internal_error } = require('../../errors.json')

const fill_buckets = async function(request, reply, db, log, lib) {

	const { api_account, api_profile, lib_auth } = lib
	const { token_random, conceal_token } = lib_auth

	let { bucket_size } = request
	if(!bucket_size) {
		bucket_size = 1000 // TODO: env var?
	}
	try {
		// generate account tokens bucket
		const account_tokens = await db('token')
			.insert(Array(bucket_size).fill({'bucket':'account'}))
			.returning('token')

		// copy account tokens to account service
		await api_account.fill_bucket({
			bucket: 'account',
			tokens: account_tokens.map(t => { return t.token })})

		// generate profile tokens bucket
		const profile_tokens = await db('token')
			.insert(Array(bucket_size).fill({'bucket':'profile'}))
			.returning('token')

		// copy profile tokens to profile service
		await api_profile.fill_bucket({
			bucket: 'profile',
			tokens: profile_tokens.map(t => { return t.token })})

		// generate email tokens
		let email_tokens = []
		for (const f of Array(bucket_size).fill("")) {
			const token = token_random() +"/"+ token_random(12)
			email_tokens.push(token)
			const { id, zkpp, salt } = await conceal_token(token)
			await db('token').insert({
				bucket: 'email',
				token: id,
				zkpp,
				salt
			})
		}
	
		// send email tokens to account service
		await api_account.fill_bucket({ bucket: 'email', tokens: email_tokens })
		
		// generate signup tokens
		let signup_tokens = []
		for (const f of Array(bucket_size).fill("")) {
			const token = token_random() +"/"+ token_random(12)
			signup_tokens.push(token)
			const { id, zkpp, salt } = await conceal_token(token)
			await db('token').insert({
				bucket: 'signup',
				token: id,
				zkpp,
				salt
			})
		}

		// send signup tokens to profile service
		await api_profile.fill_bucket({ bucket: 'signup', tokens: signup_tokens })

		log.info(`Fill/Buckets: Success: ${bucket_size}`)
		return reply.code(200).send()
	
	} catch (e) {
		log.error(`Fill/Buckets: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = fill_buckets
