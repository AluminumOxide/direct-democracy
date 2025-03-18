const get_client = require('@aluminumoxide/direct-democracy-lib-client')
const client = get_client(require('./spec.json'), require('./errors.json'))
const auth = require('@aluminumoxide/direct-democracy-lib-auth')

const clean_token = async function(token) {

	// step 1
	const { public: pke_pub, private: pke_prv } = await auth.pke_generate_keys()
	const { pke_key: pke_srv } = await client.step_one({ pke_key: pke_pub })

	// step 2
	const { public: pake_pub, private: pake_prv } = await auth.pake_client_generate_keys()
	const token_id = await auth.conceal_token(token)
	const shared_secret = await auth.pke_derive_secret(pke_srv, pke_prv)
	const encrypted_id = await auth.encrypt(token_id.id, shared_secret)
	const { pake_key: pake_srv, salt: pake_salt } = await client.step_two({ pke_key: pke_pub, pake_key: pake_pub, encrypted_id })

	// step 3
	const pake_sesh = await auth.pake_client_derive_proof(pake_salt, token_id.id, token_id.password, pake_prv, pake_srv)
	const pake_proof = pake_sesh.proof
	const { pake_proof: proof_srv, encrypted_token } = await client.step_three({ pake_key: pake_pub, pake_proof })

	// step 4
	await auth.pake_client_verify_proof(pake_pub, pake_sesh, proof_srv)
	const signed_token = await auth.decrypt(encrypted_token, shared_secret)
	// TODO: should we verify on the client that the token is unmodified?
	//const cleaned_token = await auth.jwt_verify(key, signed_token)
	const cleaned_token = signed_token

	return cleaned_token
}

module.exports = { 
	clean_token,
	fill_buckets: client.fill_buckets,
	errors: client.errors,
	schema: client.schema,
	ajv: client.ajv,
	env: client.env,
	url: client.url
}
