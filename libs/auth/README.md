# Authentication Library

## Status
Warning: This library is in active development by a non-expert, and should not be used in production.

## Overview
Provides a convenient wrapper for tools needed for our [authentication schema](../../docs/authentication.md).

## Usage

### Key Password
```
const { key, salt } = await auth.key_password(password)
or
const { key, salt } = await auth.key_password(password, salt)
```

### Symmetric Encryption
```
const encrypted = await auth.encrypt(secret, key)
const secret = await auth.decrypt(encrypted, key)
```

### Hash Chain
```
const hashed = await auth.hash_chain(secret)
or
const hashed = await auth.hash_chain(secret, 1000)
const more_hashed = await auth.hash_chain(hashed, 1000)
```

### Random Token
```
const token = await auth.token_random()
or
const token = await auth.token_random(length)
```

### JSON Web Tokens
```
const keys = await auth.jwt_keys()
const signed = await auth.jwt_sign(keys.private, payload)
const payload = await auth.jwt_verify(keys.public, signed)
```

### Public Key Exchange
```
const alice_keys = await auth.pke_generate_keys()
const bob_keys = await auth.pke_generate_keys()
const shared_secret = await auth.pke_derive_secret(bob_keys.public, alice_keys.private)
const shared_secret = await auth.pke_derive_secret(alice_keys.public, bob_keys.private)
```

### Password Authenticated Key Exchange
```
const { salt, zkpp } = await auth.pake_client_generate_zkpp(id, password)
const client_keys = await auth.pake_client_generate_keys()
const server_keys = await auth.pake_server_generate_keys(zkpp)
const { sesh, proof } = await auth.pake_client_derive_proof(salt, id, password, client_keys.private, server_keys.public)
const server_proof = await auth.pake_server_derive_proof(server_keys.private, client_keys.public, salt, zkpp, id, proof)
await auth.pake_client_verify_proof(client_keys.public, sesh, proof)
```

### Conceal Token
```
const { id, password, zkpp, salt } = await auth.conceal_token(token)
```
