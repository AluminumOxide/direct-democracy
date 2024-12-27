# Authentication Library

## Overview
Provides a convenient wrapper for tools needed for our [authentication schema](../../docs/authentication.md):
- Basic encryption from crypto-js
- SRP encryption from secure-remote-password

## Usage

### Basic Encryption
```
// user provides secret and password
const encrypted = auth.encrypt_string(secret, password)
const decrypted = auth.decrypt_string(encrypted, password)
```

### Secure Remote Password Encryption
```
// user provides id and password
const salt = auth.srp_client_generate_salt(id, password)
const verifier = auth.srp_client_generate_verifier(salt, id, password)
const client_ephem = auth.srp_client_generate_ephemeral()
const client_public = auth.srp_get_public(client_ephem)
const client_private = auth.srp_get_private(client_ephem)
const server_ephem = auth.srp_server_generate_ephemeral(verifier)
const server_public = auth.srp_get_public(server_ephem)
const server_private = auth.srp_get_private(server_ephem)
const client_sesh = auth.srp_client_derive_session(salt, id, password, client_private, server_public)
const client_proof = auth.srp_get_proof(client_sesh)
const server_sesh = auth.srp_server_derive_session(server_private, client_public, salt, id, verifier, client_proof)
const server_proof = auth.srp_get_proof(server_sesh)
auth.srp_client_verify_session(client_public, client_sesh, server_proof)
```


