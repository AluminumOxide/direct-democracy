const auth = require('./index')
const uuid = require('uuid')

let client = {}
let account = {}
let profile = {}

/* sign up */
console.log("---sign up---")

// client input
client.email = 'test@test.com'
client.password = 'passpasspass'
client.security_question = 'test test test?'
client.security_answer = 'test test test.'

// client calculations
client.account_salt = auth.srp_client_generate_salt(client.email, client.password)
client.account_verifier = auth.srp_client_generate_verifier(client.account_salt, client.email, client.password)
client.encrypted_question = auth.encrypt_string(client.security_question, client.password)

// send to account server
console.log("to account server:", client.email, client.account_verifier, client.account_salt, client.encrypted_question)
account.email = client.email
account.verifier = client.account_verifier
account.salt = client.account_salt
account.encrypted_question = client.encrypted_question

// account server calculations
account.id = uuid.v4()

// send to client
console.log("to client:", account.id)
client.account_id = account.id

// request uuid from profile server
profile.id = uuid.v4()
console.log("to client:", profile.id)

// client calculations
client.profile_id = profile.id
client.profile_salt = auth.srp_client_generate_salt(client.profile_id, client.security_answer)
client.profile_verifier = auth.srp_client_generate_verifier(client.profile_salt, client.profile_id, client.security_answer)

// send to profile server
console.log("to profile server:", client.profile_id, client.profile_salt, client.profile_verifier)
profile.id = client.profile_id
profile.salt = client.profile_salt
profile.verifier = client.profile_verifier

// client calculations
client.encrypted_profile = auth.encrypt_string(client.profile_id, client.security_answer)

// send to account server
console.log("to account server:", client.encrypted_profile)
account.encrypted_profile = client.encrypted_profile

/* sign in */
console.log("---sign in---")

// client input
client = {}
client.email = 'test@test.com'
client.password = 'passpasspass'

// client calculations
client.account_ephem = auth.srp_client_generate_ephemeral()
client.account_client_public = auth.srp_get_public(client.account_ephem)
client.account_client_private = auth.srp_get_private(client.account_ephem)

// send to server
console.log("to account server:", client.account_client_public)
account.client_public = client.account_client_public

// server calculations
account.ephem = auth.srp_server_generate_ephemeral(account.verifier)
account.server_public = auth.srp_get_public(account.ephem)
account.server_private = auth.srp_get_private(account.ephem) 

// send to client
console.log("to client:", account.server_public, account.salt)
client.account_server_public = account.server_public
client.account_salt = account.salt // ???

// client calculations
client.account_sesh = auth.srp_client_derive_session(client.account_salt, client.email, client.password, client.account_client_private, client.account_server_public)
client.account_client_proof = auth.srp_get_proof(client.account_sesh)

// send to server
console.log("to account server:", client.account_client_proof)
account.client_proof = client.account_client_proof

// server calculations
account.sesh = auth.srp_server_derive_session(account.server_private, account.client_public, account.salt, account.email, account.verifier, account.client_proof)
account.server_proof = auth.srp_get_proof(account.sesh)

// send to client
console.log("to client:", account.server_proof)
client.account_server_proof = account.server_proof

// client calculations
auth.srp_client_verify_session(client.account_client_public, client.account_sesh, client.account_server_proof)
console.log("account login success")

// send to client
console.log("to client:", account.encrypted_profile, account.encrypted_question)
client.encrypted_profile = account.encrypted_profile
client.encrypted_question = account.encrypted_question

// client calculations
client.security_question = auth.decrypt_string(client.encrypted_question, client.password)

// client input
client.security_answer = 'test test test.'

// client calculations
client.profile_id = auth.decrypt_string(client.encrypted_profile, client.security_answer)
client.profile_ephem = auth.srp_client_generate_ephemeral()
client.profile_client_public = auth.srp_get_public(client.profile_ephem)
client.profile_client_private = auth.srp_get_private(client.profile_ephem)

// send to profile server
console.log("to profile server:", client.profile_id, client.profile_client_public)
profile.client_public = client.profile_client_public

// server calculations
profile.ephem = auth.srp_server_generate_ephemeral(profile.verifier)
profile.server_public = auth.srp_get_public(profile.ephem)
profile.server_private = auth.srp_get_private(profile.ephem) 

// send to client
console.log("to client:", profile.server_public, profile.salt)
client.profile_server_public = profile.server_public
client.profile_salt = profile.salt // ???

// client calculations
client.profile_sesh = auth.srp_client_derive_session(client.profile_salt, client.profile_id, client.security_answer, client.profile_client_private, client.profile_server_public)
client.profile_client_proof = auth.srp_get_proof(client.profile_sesh)

// send to server
console.log("to profile server:", client.profile_client_proof)
profile.client_proof = client.profile_client_proof

// server calculations
profile.sesh = auth.srp_server_derive_session(profile.server_private, profile.client_public, profile.salt, profile.id, profile.verifier, profile.client_proof)
profile.server_proof = auth.srp_get_proof(profile.sesh)

// send to client
console.log("to client:", profile.server_proof)
client.profile_server_proof = profile.server_proof

// client calculations
auth.srp_client_verify_session(client.profile_client_public, client.profile_sesh, client.profile_server_proof)
console.log("profile login success")


