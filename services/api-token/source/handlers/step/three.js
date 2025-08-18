const { invalid_input, internal_error } = require('../../errors.json')

const step_three = async function(request, reply, db, log, lib) {

	const { pake_server_derive_proof, encrypt } = lib.lib_auth
	const { pake_key, pake_proof } = request

	try {
		// lookup private pake key, token and shared secret
		const auth_lookup = await db('auth').select(['token_id','pake_private','pke_secret']).where({ pake_public: pake_key })
		if(!auth_lookup || auth_lookup.length < 1) {
			log.warn(`Step/Three: Failure: Invalid pake key`)
			return reply.code(400).send(new Error(invalid_input))
		}
		const token = auth_lookup[0].token_id
		const pake_private = auth_lookup[0].pake_private
		const pke_secret = auth_lookup[0].pke_secret

		// lookup bucket, zkpp and salt
		const token_lookup = await db('token').select(['bucket','zkpp','salt']).where({ token })
		if(!token_lookup || token_lookup.length < 1) {
			log.warn(`Step/Three: Failure: Invalid token`)
			return reply.code(400).send(new Error(invalid_input))
		}
		const salt = token_lookup[0].salt
		const zkpp = token_lookup[0].zkpp
		const bucket = token_lookup[0].bucket

		// generate server proof (verifies client)
		let server_proof
		try {
			server_proof = await pake_server_derive_proof(pake_private, pake_key, salt, zkpp, token, pake_proof)
		} catch(e) {
			log.warn(`Step/Three: Failure: Invalid proof`)
			return reply.code(400).send(new Error(invalid_input))
		}

		// determine bucket
		let new_bucket = 'profile'
		if(bucket === 'signup') {
			new_bucket = 'account'
		}
		
		// select random token from bucket
		const rand_lookup = await db('token').where({ bucket: new_bucket }).orderByRaw('random()').limit(1).del(['token'])
		const rand_token = rand_lookup[0].token

		// sign token
		const sign_token = await lib.jwt.sign({ 'token': rand_token })

		// encrypt token
		const encrypted_token = await encrypt(sign_token, pke_secret)
	
		log.info(`Step/Three: Success: ${pake_key}`)
		return reply.code(200).send({
			pake_proof: server_proof,
			encrypted_token
		})

	} catch (e) {
		log.error(`Step/Three: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = step_three
