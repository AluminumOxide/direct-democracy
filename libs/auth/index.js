const crypto = require('crypto-js')
const srp_client = require('secure-remote-password/client')
const srp_server = require('secure-remote-password/server')


/* basic encryption */

const encrypt_string = function(secret, password) {
	return crypto.AES.encrypt(secret, password).toString()
}

const decrypt_string = function(encrypted, password) {
	return crypto.AES.decrypt(encrypted, password).toString(crypto.enc.Utf8)
}

/* srp encryption */

const srp_get_public = function(ephem) {
	return ephem.public
}
const srp_get_private = function(ephem) {
	return ephem.secret
}
const srp_get_proof = function(sesh) {
	return sesh.proof
}

// step 1
const srp_client_generate_salt = function(email, password) {
	return srp_client.generateSalt()
}

// step 2
const srp_client_generate_verifier = function(salt, email, password) {
	const private_key = srp_client.derivePrivateKey(salt, email, password)
	return srp_client.deriveVerifier(private_key)
}

// step 3
const srp_client_generate_ephemeral = function() {
	return srp_client.generateEphemeral()
}

// step 4
const srp_server_generate_ephemeral = function(verifier) {
	return srp_server.generateEphemeral(verifier)
}

// step 5
const srp_client_derive_session = function(salt, email, password, client_private, server_public) {
	const private_key = srp_client.derivePrivateKey(salt, email, password)
	return srp_client.deriveSession(client_private, server_public, salt, email, private_key)
}

// step 6
const srp_server_derive_session = function(server_private, client_public, salt, email, verifier, client_proof) {
	return srp_server.deriveSession(server_private, client_public, salt, email, verifier, client_proof)
}

// step 7
const srp_client_verify_session = function(client_public, client_sesh, server_proof) {
	return srp_client.verifySession(client_public, client_sesh, server_proof)
}

module.exports = {
	encrypt_string,
	decrypt_string,
	srp_get_public,
	srp_get_private,
	srp_get_proof,
	srp_client_generate_salt,
	srp_client_generate_verifier,
	srp_client_generate_ephemeral,
	srp_server_generate_ephemeral,
	srp_client_derive_session,
	srp_server_derive_session,
	srp_client_verify_session
}
