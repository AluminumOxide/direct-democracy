const { internal_error } = require('../../errors.json')

const step_one = async function(request, reply, db, log, lib) {

	const { pke_generate_keys, pke_derive_secret } = lib.lib_auth 
	const { pke_key } = request

	try {
		// generate our own pke keys
		const { public: pke_pub, private: pke_prv} = await pke_generate_keys()

		// generate shared secret
		const pke_secret = await pke_derive_secret(pke_key, pke_prv)

		// store shared secret and their public key
		await db('auth').insert({
			pke_secret,
			pke_public: pke_key
		})

		log.info(`Step/One: Success: ${pke_key}`)
		return reply.code(200).send({ pke_key: pke_pub })

	} catch (e) {
		log.error(`Step/One: Failure: Error: ${e}`)
		return reply.code(500).send(new Error(internal_error))
	}
}

module.exports = step_one
