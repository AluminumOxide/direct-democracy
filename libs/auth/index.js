const { Buffer } = require('node:buffer')
const { subtle, createCipheriv, createDecipheriv, createECDH, createHash, getRandomValues, randomBytes, randomFillSync, scryptSync } = require('node:crypto')

/* key conversions */

const key_salt_len = 24

const key_stringify = async function(key) {
	const key_jwk = await subtle.exportKey('jwk', key)
	return Buffer.from(JSON.stringify(key_jwk), 'utf-8').toString('hex')
}

const key_destringify = async function(key, algo, ops) {
	const key_jwk = JSON.parse(Buffer.from(key, 'hex').toString('utf-8'))
	return await subtle.importKey('jwk', key_jwk, algo, true, ops)
}

const key_password = async function(password, salt=false) {
	if(!salt) {
		salt = randomBytes(key_salt_len/2).toString('hex')
	}
	const te = new TextEncoder()
	const mat = await subtle.importKey('raw', te.encode(password), 'PBKDF2', false, ['deriveKey'])
	const key = await subtle.deriveKey({
		name: 'PBKDF2',
		hash: 'SHA-512',
		salt: te.encode(salt),
		iterations: 1000
	}, mat, {
		name: 'AES-CBC',
		length: 256
	}, true, ['encrypt','decrypt'])
	const key_str = await key_stringify(key)
	return { key: key_str, salt }
}

/* symmetric encryption */

const sym_algo = 'AES-CBC'
const sym_len = 256
const sym_iv_len = 16

const encrypt = async function(secret, key) {
	const te = new TextEncoder()
	key = await key_destringify(key, { name: 'AES-CBC', length: 256 },['encrypt'])
	const iv = getRandomValues(new Uint8Array(sym_iv_len))
	const encrypted = await subtle.encrypt({ name: sym_algo, iv }, key, te.encode(secret))
	return Buffer.from(encrypted).toString('hex') + Buffer.from(iv).toString('hex')
}

const decrypt = async function(enc, key) {
	key = await key_destringify(key, { name: 'AES-CBC', length: 256 },['decrypt'])
	const encrypted = enc.substring(0, enc.length-sym_iv_len*2)
	const iv = enc.substring(enc.length-sym_iv_len*2)
	const decrypted = await subtle.decrypt({ name: sym_algo, iv: Buffer.from(iv, 'hex') }, key, Buffer.from(encrypted, 'hex'))
	return (new TextDecoder()).decode(decrypted)
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

/* token */
const token_len = 32

const token_random = function(len=false) {
	return randomBytes(!!len?len:token_len).toString('hex')
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
	const public_key = await key_stringify(keys.publicKey)
	const private_key = await key_stringify(keys.privateKey)
	return { public: public_key, private: private_key }
}

const pke_derive_secret = async function(public_key, private_key) {
	const pub_key = await key_destringify(public_key, { name: pke_curve }, [])
	const pvt_key = await key_destringify(private_key, { name: pke_curve }, ['deriveKey'])
	const secret = await subtle.deriveKey(
		{ name: pke_curve, public: pub_key },
		pvt_key,
		{ name: sym_algo, length: sym_len },
		true,
		['encrypt', 'decrypt'])
	return await key_stringify(secret)
}

/* conceal token */

const conceal_len = 1000

const conceal_token = async function(token) {
	const hashed = await hash_chain(token, conceal_len)
	const id = hashed.slice(0, token_len)
	const password = hashed.slice(token_len)
	const { zkpp, salt } = await pake_client_generate_zkpp(id, password)
	return { id, password, zkpp, salt }
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
	key_password,
	encrypt,
	decrypt,
	hash_chain,
	token_random,
	conceal_token,
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
