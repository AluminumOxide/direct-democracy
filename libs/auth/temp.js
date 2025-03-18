


const run_test = async function() {

	const { randomBytes, subtle } = require('node:crypto')
	//

	//
	//const hash_chain = async function(token, n=1000) {
	//	let salt = randomBytes(32).toString('hex')
	//	const segs = token.split('/')
	//	if(segs.length == 2) {
	//		token = segs[0]
	//		salt = segs[1]
	//	}
	//	const te = new TextEncoder()
	//	const mat = await subtle.importKey('raw', te.encode(token), 'PBKDF2', false, ['deriveKey'])
	//	const key = await subtle.deriveKey({
	//		name: 'PBKDF2',
	//		hash: 'SHA-512',
	//		salt: te.encode(salt),
	//		iterations: n
	//	}, mat, {
	//		name: 'HMAC',
	//		hash: 'SHA-512'
	//	}, true, ['sign'])
	//	const val = await subtle.exportKey('raw', key)
	//	return Buffer.from(val).toString('hex') + '/' + salt

	//}

	const { hash_chain } = require('./index')
	const token_a = randomBytes(32).toString('hex')
	const token_b = await hash_chain(token_a)
	console.log(token_b)
	console.log(await hash_chain(token_b))	
	






	//const { hash_chain } = require('./index')
	//const token_a = '8823081a3eb4ef82da461bf33c80a2e93a83641617aa4e3fbcc943baf356e4751a5bc2ba222163d3e2f9437bb0673f796b96a47f55e8bf0f29339f6c8000ef2f337b74b22bce62587f44d0128cc51434dcf8ec331fabff6ee5570e51d7970d5fe8232c2f9f534d78803854ea9c5983f04119bdd240944641971839ff021d9237'	
	//const hashed_a = await hash_chain(1, token)
	//console.log(hashed_a)


}
run_test()


//const run_test = async function() {
//
//const { encrypt, decrypt } = require('./index')
//const password = 'passwordpasswordpasswordpasswordpasswordpasswordpassword'
//
//const encrypted = await encrypt('thisissecret', password)
//console.log(encrypted)
//
//const decrypted = await decrypt(encrypted, password)
//console.log(decrypted)
//
//}
//run_test()



//const run_test = async function() {
//
//	const { pke_generate_keys, pke_derive_secret, encrypt, decrypt } = require('./index')
//
//	// client
//	const client_keys = await pke_generate_keys()
//
//	// send
//	const client_public_key = client_keys.publicKey
//
//	// server
//	const server_keys = await pke_generate_keys()
//	const s_shared_key = await pke_derive_secret(client_public_key, server_keys.privateKey)
//	const encrypted = await encrypt('thisisasecretmessage', s_shared_key)
//
//	// send
//	const server_public_key = server_keys.publicKey
//	console.log(encrypted)
//
//	// client
//	const c_shared_key = await pke_derive_secret(server_public_key, client_keys.privateKey)
//	const decrypted = await decrypt(encrypted, c_shared_key)
//	console.log(decrypted)
//
//}
//run_test()

//const run_test = async function() {
//	const auth = require('./')
//	const email = 'testy@test.test'
//	const password = 'testtesttesttesttesttsetsetsetsetsetsetsetsetsetsetset'
//
//	/* signup */
//
//	// client
//	const zkpp = auth.pake_client_generate_zkpp(email, password)
//
//	console.log(email, zkpp)
//
//	/* signin */
//
//	// client
//	const ckeys = auth.pake_client_generate_keys()
//	const cpublic = ckeys.public
//	const cprivate = ckeys.private
//
//	console.log(email, cpublic)
//
//	// server
//	const skeys = auth.pake_server_generate_keys(zkpp)
//	const spublic = skeys.public
//	const sprivate = skeys.private
//
//	console.log(spublic, zkpp.salt)
//
//	// client
//	const csesh = auth.pake_client_derive_proof(zkpp, email, password, cprivate, spublic)
//	const cproof = csesh.proof
//
//	console.log(email, cproof)
//
//	// server
//	const sproof = auth.pake_server_derive_proof(sprivate, cpublic, zkpp, email, cproof)
//	
//	console.log(sproof)
//
//	// client
//	auth.pake_client_verify_proof(cpublic, csesh, sproof)
//}
//run_test()

//const run_test = async function() {
//	const { jwt_key, jwt_sign, jwt_verify } = require('./')
//	const { publicKey, privateKey } = await jwt_key()
//	const jwt = await jwt_sign(privateKey, { 'test': 'testtesttest' })
//	console.log(jwt)
//	const data = await jwt_verify(publicKey, jwt)
//	console.log(data)
//}
//run_test()

