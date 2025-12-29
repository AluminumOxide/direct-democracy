const get_client = require('@aluminumoxide/direct-democracy-lib-client')
const server = get_client(require('./spec.json'), require('./errors.json'))
// TODO: re-enable auth
//const auth = require('@aluminumoxide/direct-democracy-lib-auth')
//const uuid = require('uuid')
//
///* client sign up */
//
//const client_sign_up = async function({ answer, profile_token }) {
//
//	// generate a profile id
//	const profile_id = uuid.v4()
//
//	// generate zkpp and salt
//	const { zkpp, salt } = auth.pake_client_generate_zkpp(profile_id, answer)
//
//	// call server
//	const { token } = await server.sign_up({ profile_id, zkpp, salt, profile_token})
//
//	return { profile_id, token }
//}
//
///* client sign in */
//
//const client_sign_in = async function({ profile_id, answer }) {
//	
//	// generate pake keys
//	const { public: public_key, private: private_key } = auth.pake_client_generate_keys()
//
//	// initialize signin
//	const { salt, key } = await server.sign_in_init({ profile_id, key: public_key })
//
//	// calculate session and proof
//	const client_sesh = auth.pake_client_derive_proof(salt, profile_id, answer, private_key, key)
//
//	// send proof to server
//	const { proof, jwt } = await server.sign_in_finish({ profile_id, key: client_sesh.proof })
//
//	// verify server proof
//	auth.pake_client_verify_proof(public_key, client_sesh, proof)
//
//	return { jwt }
//}

module.exports = {
	...server,
//	client_sign_up,
//	client_sign_in
}
