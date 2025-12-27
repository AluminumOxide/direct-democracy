const auth = require('./index')

const run_test = async function () {

let client = {}
let account = {}
let profile = {}
let token = {}

const email = 'test@test.com'
const password = 'pasasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfspass'
const question = 'test test test?'
const answer = 'passpasasdfasdfasdfasdfasdfasdfasdfsaasdfasdfs'

/* initialize servers */
let N = 100
let M = 12
account.jwt_keys = await auth.jwt_new_keys()
profile.jwt_keys = await auth.jwt_new_keys()
token.jwt_keys = await auth.jwt_new_keys()
token.account_tokens = [auth.uuid_random()]
account.account_tokens = token.account_tokens
token.profile_tokens = [auth.uuid_random()] 
profile.profile_tokens = token.profile_tokens
token.db = {}
token.email_tokens = [auth.uuid_random()]
let hashed = await auth.hash_chain(token.email_tokens[0], N)
token.email_tokens[0] = token.email_tokens[0] + '/' + hashed.split('/')[1]
let id = hashed.slice(0, M)
let pass = hashed.slice(M)
token.db[id] = { bucket: 'email', zkpp: auth.pake_client_generate_zkpp(id, pass) }
account.email_tokens = token.email_tokens
delete token.email_tokens
token.signup_tokens = [auth.uuid_random()]
hashed = await auth.hash_chain(token.signup_tokens[0], N)
token.signup_tokens[0] = token.signup_tokens[0] + '/' + hashed.split('/')[1]
id = hashed.slice(0, M)
pass = hashed.slice(M)
token.db[id] = { bucket: 'signup', zkpp: auth.pake_client_generate_zkpp(id, pass) }
profile.signup_tokens = token.signup_tokens
delete token.signup_tokens

/* sign up */
console.log("---sign up---")

// client input
client.email = email
client.password = password
client.security_question = question
client.security_answer = answer

// client calculations
let { salt, zkpp } = await auth.pake_client_generate_zkpp(client.email, client.password)
client.account_salt = salt
client.account_zkpp = zkpp
client.encrypted_question = await auth.encrypt(client.security_question, client.password)

// send to account server
console.log("to account server:", client.email, client.account_zkpp, client.account_salt, client.encrypted_question)
account.email = client.email
account.zkpp = client.account_zkpp
account.salt = client.account_salt
account.encrypted_question = client.encrypted_question

// account server calculations
account.id = auth.uuid_random()

// send client email token
client.email_token = account.email_tokens[0]
console.log("to user email", client.email_token)
let clean_token = async function(dirty_token) {
	
	// step one
	let { public: client_pke_public, private: client_pke_private } = await auth.pke_generate_keys()
	console.log("to token server", client_pke_public)
	let { public: server_pke_public, private: server_pke_private } = await auth.pke_generate_keys()
	// store client_pke_public, server_pke_private
	console.log("to client", server_pke_public)

	let hashed = await auth.hash_chain(dirty_token, N)
	let id = hashed.slice(0, M)
	let pass = hashed.slice(M)
	let client_shared_secret = await auth.pke_derive_secret(server_pke_public, client_pke_private)
	let encrypted_id = await auth.encrypt(id, client_shared_secret)
	let { public: client_pake_public, private: client_pake_private } = await auth.pake_client_generate_keys()

	// step two
	console.log("to token server", client_pke_public, encrypted_id, client_pake_public)
	let server_shared_secret = await auth.pke_derive_secret(client_pke_public, server_pke_private)
	let decrypted_id = await auth.decrypt(encrypted_id, server_shared_secret)
	let db_entry = token.db[decrypted_id]
	let { public: server_pake_public, private: server_pake_private } = await auth.pake_server_generate_keys(db_entry.zkpp.zkpp)
	let salt = db_entry.zkpp.salt
	// store server_shared_secret, server_pake_private, id, client_pake_public
	console.log("to client", server_pake_public, salt)
	let client_sesh = await auth.pake_client_derive_proof(salt, id, pass, client_pake_private, server_pake_public)
	let client_proof = client_sesh.proof

	// step three
	console.log("to token server:", client_proof)
	let server_proof = await auth.pake_server_derive_proof(server_pake_private, client_pake_public, salt, db_entry.zkpp.zkpp, decrypted_id, client_proof)
	let random_token = token.profile_tokens[0]
	if(db_entry.bucket == 'signup') {
		random_token = token.account_tokens[0]
	}

	let signed_token = await auth.jwt_sign(token.jwt_keys.private, { token: random_token })
	let encrypted_clean_token = await auth.encrypt(signed_token, server_shared_secret)

	console.log("to client", encrypted_clean_token, server_proof)
	await auth.pake_client_verify_proof(client_pake_public, client_sesh, server_proof)
	let clean_signed_token = await auth.decrypt(encrypted_clean_token, client_shared_secret)
	let clean_token = await auth.jwt_verify(token.jwt_keys.public, clean_signed_token)
	return clean_token.token		
}

// client calculations
client.profile_token = await clean_token(client.email_token)
client.profile_id = auth.uuid_random()
let { salt: salt1, zkpp: zkpp1 } = await auth.pake_client_generate_zkpp(client.profile_id, client.security_answer)
client.profile_salt = salt1
client.profile_zkpp = zkpp1

// send to profile server
console.log("to profile server:", client.profile_token, client.profile_id, client.profile_salt, client.profile_zkpp)

// profile calculations
if(profile.profile_tokens.indexOf(client.profile_token) < 0) {
	console.log("invalid profile token!")
	return
}
profile.id = client.profile_id
profile.salt = client.profile_salt
profile.zkpp = client.profile_zkpp
client.signup_token = profile.signup_tokens[0]

// send to client
console.log("to client:", client.signup_token)
client.account_token =  await clean_token(client.signup_token)

// client calculations
client.encrypted_profile = await auth.encrypt(profile.id, client.security_answer)

// send to account server
console.log("to account server:", client.account_token, client.email_token, client.encrypted_profile)
if(account.account_tokens.indexOf(client.account_token) < 0) {
	console.log("invalid account token!")
	return
}
// look up account using email token
account.encrypted_profile = client.encrypted_profile


/* sign in */
console.log("---sign in---")

// client input
client = {}
client.email = email
client.password = password

// client calculations
let { public: public1, private: private1 } = await auth.pake_client_generate_keys()
client.account_client_public = public1
client.account_client_private = private1

// send to server
console.log("to account server:", client.account_client_public)
account.client_public = client.account_client_public

// server calculations
let { public: public2, private: private2 } = await auth.pake_server_generate_keys(account.zkpp)
account.server_public = public2
account.server_private = private2

// send to client
console.log("to client:", account.server_public, account.salt)
client.account_server_public = account.server_public
client.account_salt = account.salt

// client calculations
client.account_client_sesh = await auth.pake_client_derive_proof(client.account_salt, client.email, client.password, client.account_client_private, client.account_server_public)
client.account_client_proof = client.account_client_sesh.proof

// send to server
console.log("to account server:", client.account_client_proof)
account.client_proof = client.account_client_proof

// server calculations
account.server_proof = await auth.pake_server_derive_proof(account.server_private, account.client_public, account.salt, account.zkpp, account.email, account.client_proof)
account.account_jwt = await auth.jwt_sign(account.jwt_keys.private, { account_id: account.id })

// send to client
console.log("to client:", account.server_proof, account.account_jwt)
client.account_server_proof = account.server_proof
client.account_jwt = account.account_jwt

// client calculations
client.account_id = await auth.jwt_verify(account.jwt_keys.public, client.account_jwt)
await auth.pake_client_verify_proof(client.account_client_public, client.account_client_sesh, client.account_server_proof)
console.log("account login success")

// send to client
console.log("to client:", account.encrypted_profile, account.encrypted_question)
client.encrypted_profile = account.encrypted_profile
client.encrypted_question = account.encrypted_question

// client calculations
client.security_question = await auth.decrypt(client.encrypted_question, client.password)

// client input
client.security_answer = answer

// client calculations
client.profile_id = await auth.decrypt(client.encrypted_profile, client.security_answer)
let { public: public3, private: private3 } = await auth.pake_client_generate_keys()
client.profile_client_public = public3
client.profile_client_private = private3

// send to profile server
console.log("to profile server:", client.profile_id, client.profile_client_public)
profile.client_public = client.profile_client_public

// server calculations
let { public: public4, private: private4 } = await auth.pake_server_generate_keys(profile.zkpp)
profile.server_public = public4
profile.server_private = private4

// send to client
console.log("to client:", profile.server_public, profile.salt)
client.profile_server_public = profile.server_public
client.profile_salt = profile.salt

// client calculations
client.profile_client_sesh = await auth.pake_client_derive_proof(client.profile_salt, client.profile_id, client.security_answer, client.profile_client_private, client.profile_server_public)
client.profile_client_proof = client.profile_client_sesh.proof

// send to server
console.log("to profile server:", client.profile_client_proof)
profile.client_proof = client.profile_client_proof

// server calculations
profile.server_proof = await auth.pake_server_derive_proof(profile.server_private, profile.client_public, profile.salt, profile.zkpp, profile.id, profile.client_proof)
profile.profile_jwt = await auth.jwt_sign(profile.jwt_keys.private, { profile_id: profile.id })

// send to client
console.log("to client:", profile.server_proof, profile.profile_jwt)
client.profile_server_proof = profile.server_proof
client.profile_jwt = profile.profile_jwt

// client calculations
client.profile_id = await auth.jwt_verify(profile.jwt_keys.public, client.profile_jwt) 
await auth.pake_client_verify_proof(client.profile_client_public, client.profile_client_sesh, client.profile_server_proof)
console.log("profile login success")

}

run_test()
