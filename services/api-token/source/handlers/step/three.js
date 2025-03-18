const { internal_error } = require('../../errors.json')
const auth = require('@aluminumoxide/direct-democracy-lib-auth')

const step_three = async function(request, reply, db, log) {
	const { pake_key, pake_proof } = request

	try {
		// lookup private pake key, token and shared secret
		const auth_lookup = await db('auth').select(['token_id','pake_private','pke_secret']).where({ pake_public: pake_key })
		const token = auth_lookup[0].token_id
		const pake_private = auth_lookup[0].pake_private
		const pke_secret = auth_lookup[0].pke_secret

		// lookup bucket, zkpp and salt
		const token_lookup = await db('token').select(['bucket','zkpp','salt']).where({ token })
		const salt = token_lookup[0].salt
		const zkpp = token_lookup[0].zkpp
		const bucket = token_lookup[0].bucket

		// generate server proof (verifies client)
		const server_proof = await auth.pake_server_derive_proof(pake_private, pake_key, salt, zkpp, token, pake_proof)

		// determine bucket
		let new_bucket = 'profile'
		if(bucket === 'signup') {
			new_bucket = 'account'
		}
		
		// select random token from bucket
		const rand_lookup = await db('token').where({ bucket: new_bucket }).orderByRaw('random()').limit(1).del(['token'])
		const rand_token = rand_lookup[0].token

		// sign token
		// TODO: should we verify on the client that the token is unmodified?
		//const sign_token = await auth.jwt_sign(key, { 'token': rand_token })
		const sign_token = rand_token

		// encrypt token
		const encrypted_token = await auth.encrypt(sign_token, pke_secret)
	
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
