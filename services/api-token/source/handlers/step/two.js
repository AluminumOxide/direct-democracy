const { invalid_input, internal_error } = require('../../errors.json')

const step_two = async function(request, reply, db, log, lib) {

	const { decrypt, pake_server_generate_keys } = lib.lib_auth
	const { pke_key, pake_key, encrypted_id } = request

	try {
		// lookup secret key for provided public
		const auth_lookup = await db('auth').select(['pke_secret']).where({ pke_public: pke_key })
		if(!auth_lookup || auth_lookup.length < 1) {
			log.warn(`Step/Two: Failure: Invalid pke key`)
			return reply.code(400).send(new Error(invalid_input))
		}
		const pke_secret = auth_lookup[0].pke_secret

		// decrypt encrypted id
		const token_id = await decrypt(encrypted_id, pke_secret)

		// lookup zkpp and salt for decrypted id
		const tkn_lookup = await db('token').select(['zkpp', 'salt']).where({ token: token_id })
		if(!tkn_lookup || tkn_lookup.length < 1) {
			log.warn(`Step/Two: Failure: Invalid token`)
			return reply.code(400).send(new Error(invalid_input))
		}
		const zkpp = tkn_lookup[0].zkpp
		const salt = tkn_lookup[0].salt

		// generate pake keys
		const { public: pake_public, private: pake_private } = await pake_server_generate_keys(zkpp)

		// save id, pake client public and server private keys
		await db('auth').update({
			token_id,
			pake_private,
			pake_public: pake_key,
		}).where({ pke_public: pke_key })

		// send back public pake key and salt
		log.info(`Step/Two: Success: ${pke_key}`)
		return reply.code(200).send({
			pake_key: pake_public,
			salt
		})

	} catch (e) {
		log.error(`Step/Two: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = step_two
