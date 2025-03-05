const { Buffer } = require('node:buffer')
const { subtle, createCipheriv, createDecipheriv, createECDH, createHash, getRandomValues, randomBytes, randomFillSync, scryptSync } = require('node:crypto')

/* symmetric encryption */

const sym_algo = 'AES-CBC'
const sym_len = 256
const sym_iv_len = 16
const sym_salt_len = 24

const encrypt = async function(secret, key) {
	let salt = ''
	const te = new TextEncoder()
	if(typeof key === 'string') {
		salt = randomBytes(sym_salt_len/2).toString('hex')
		const mat = await subtle.importKey('raw', te.encode(key), 'PBKDF2', false, ['deriveKey'])
		key = await subtle.deriveKey({
			name: 'PBKDF2',
			hash: 'SHA-512',
			salt: te.encode(salt),
			iterations: 1000
		}, mat, {
			name: 'AES-CBC',
			length: 256
		}, true, ['encrypt'])
	}
	const iv = getRandomValues(new Uint8Array(sym_iv_len))
	const encrypted = await subtle.encrypt({ name: sym_algo, iv }, key, te.encode(secret))
	return salt + Buffer.from(encrypted).toString('hex') + Buffer.from(iv).toString('hex')
}

const decrypt = async function(enc, key) {
	let encrypted = enc.substring(0, enc.length-sym_iv_len*2)
	const te = new TextEncoder()
	if(typeof key === 'string') {
		encrypted = enc.substring(sym_salt_len, enc.length-sym_iv_len*2)
		const salt = enc.substring(0, sym_salt_len)
		const mat = await subtle.importKey('raw', te.encode(key), 'PBKDF2', false, ['deriveKey'])
		key = await subtle.deriveKey({
			name: 'PBKDF2',
			hash: 'SHA-512',
			salt: te.encode(salt),
			iterations: 1000
		}, mat, {
			name: 'AES-CBC',
			length: 256
		}, true, ['decrypt'])
	}
	const iv = enc.substring(enc.length-sym_iv_len*2)
	const decrypted = await subtle.decrypt({ name: sym_algo, iv: Buffer.from(iv, 'hex') }, key, Buffer.from(encrypted, 'hex'))
	return new TextDecoder().decode(decrypted)
}

/* hash chain */

const hash_algo = 'SHA-512' // TODO: check if keccak / sha3

const hash_chain = async function(secret, n=1000) {
	let salt = randomBytes(32).toString('hex')
	const segs = secret.split('/')
	if(segs.length == 2) {
		secret = segs[0]
		salt = segs[1]
	}
	const te = new TextEncoder()
	const mat = await subtle.importKey('raw', te.encode(secret), 'PBKDF2', false, ['deriveKey'])
	const key = await subtle.deriveKey({
		name: 'PBKDF2',
		hash: hash_algo,
		salt: te.encode(salt),
		iterations: n
	}, mat, {
		name: 'HMAC',
		hash: hash_algo
	}, true, ['sign'])
	const val = await subtle.exportKey('raw', key)
	return Buffer.from(val).toString('hex') + '/' + salt
}

/* signature */

const jwt_sig = 'RSASSA-PKCS1-v1_5'
const jwt_len = 2048
const jwt_hash = hash_algo

const jwt_keys = async function() {
	const keys = await subtle.generateKey({
		name: jwt_sig,
		modulusLength: jwt_len,
		publicExponent: new Uint8Array([1, 0, 1]),
		hash: jwt_hash
	}, true, ['sign', 'verify'])
	return { public: keys.publicKey, private: keys.privateKey }
}

const jwt_sign = async function(key, data) {
	const header = { alg: jwt_hash, typ: 'JWT' }
	const payload = (Buffer.from(JSON.stringify(header), 'utf8')).toString('base64')+'.'+(Buffer.from(JSON.stringify(data), 'utf8')).toString('base64')
	const signature = await subtle.sign(jwt_sig, key, (new TextEncoder()).encode(payload))
	return payload+'.'+Buffer.from(signature).toString('base64') 
}

const jwt_verify = async function(key, jwt) {
	const segments = jwt.split('.')
	const header = JSON.parse(Buffer.from(segments[0], 'base64').toString('utf8'))
	if(header.alg !== jwt_hash) { return false }
	const payload = JSON.parse(Buffer.from(segments[1], 'base64').toString('utf8'))
	const signature = Buffer.from(segments[2], 'base64')
	const verified = await subtle.verify(jwt_sig, key, signature, (new TextEncoder()).encode(segments[0]+'.'+segments[1]))
	if(!!verified) {
		return payload
	} else {
		return false
	}
}

/* public key exchange */

const pke_curve = 'X25519'

const pke_generate_keys = async function() {
	const keys = await subtle.generateKey({
		name: pke_curve
	}, true, ['deriveKey'])
	const public_key = await subtle.exportKey('raw', keys.publicKey)
	const private_key = await subtle.exportKey('jwk', keys.privateKey) // TODO: should probably wrap instead
	return { public: public_key, private: private_key.d+'/'+private_key.x }
}

const pke_derive_secret = async function(public_key, private_key) {
	const pub_key = await subtle.importKey('raw', public_key, { name: pke_curve }, true, [])
	const segs = private_key.split('/')
	const pvt_key = await subtle.importKey('jwk', {
		d: segs[0],
		x: segs[1],
		key_ops: ['deriveKey'],
		ext: true,
		crv: pke_curve,
		kty: 'OKP'
	}, { name: pke_curve }, true, ['deriveKey'])
	return await subtle.deriveKey(
		{ name: pke_curve, public: pub_key },
		pvt_key,
		{ name: sym_algo, length: sym_len },
		true,
		['encrypt', 'decrypt'])
}

/* password authenticated key exchange */

// TODO: this lib hasn't been updated in 7 years and is using a static big prime :/ ... replace this
const srp_client = require('secure-remote-password/client')
const srp_server = require('secure-remote-password/server')

// step 1
const pake_client_generate_zkpp = function(email, password) {
	const salt = srp_client.generateSalt()
	const private_key = srp_client.derivePrivateKey(salt, email, password)
	const zkpp = srp_client.deriveVerifier(private_key)
	return { salt, zkpp }
}

// step 2
const pake_client_generate_keys = function() {
	const ephem = srp_client.generateEphemeral()
	return { public: ephem.public, private: ephem.secret }
}

// step 3
const pake_server_generate_keys = function(zkpp) {
	const ephem = srp_server.generateEphemeral(zkpp)
	return { public: ephem.public, private: ephem.secret }
}

// step 4
const pake_client_derive_proof = function(salt, email, password, client_private, server_public) {
	const private_key = srp_client.derivePrivateKey(salt, email, password)
	return srp_client.deriveSession(client_private, server_public, salt, email, private_key)
}

// step 5
const pake_server_derive_proof = function(server_private, client_public, salt, zkpp, email, client_proof) {
	return (srp_server.deriveSession(server_private, client_public, salt, email, zkpp, client_proof)).proof
}

// step 6
const pake_client_verify_proof = function(client_public, client_sesh, server_proof) {
	return srp_client.verifySession(client_public, client_sesh, server_proof)
}

module.exports = {
	encrypt,
	decrypt,
	hash_chain,
	jwt_keys,
	jwt_sign,
	jwt_verify,
	pke_generate_keys,
	pke_derive_secret,
	pake_client_generate_zkpp,
	pake_client_generate_keys,
	pake_client_derive_proof,
	pake_client_verify_proof,
	pake_server_generate_keys,
	pake_server_derive_proof
}
