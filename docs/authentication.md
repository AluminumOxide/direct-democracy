# Authentication Scheme

## Motivation
Allow for email login and account recovery, while preserving the anonymity of users, even if the server's database has been compromised.

## Sign In
```mermaid
sequenceDiagram
    participant Account
    participant Client
    participant Profile
    Note over Client: user enters email and password
    Note over Client: generate client_ephem and client_public key
    Client->>Account: email, client_public
    Note over Account: generate server_ephem using stored verifier and salt
    Note over Account: derive server_private and server_public keys from server_ephem
    Note over Account: save server_private and client_public
    Account->>Client: server_public, salt
    Note over Client: generate client_sesh from salt, email, password, client_ephem and server_public
    Note over Client: derive client_proof from client_sesh
    Client->>Account: client_proof
    Note over Account: generate server_sesh from server_private, client_public, salt, email, verifier and client_proof
    Note over Account: derive server_proof from server_sesh
    Note over Account: login verified, return stored data
    Account->>Client: server_proof, encrypted_profile, encrypted_question
    Note over Client: verify session using client_ephem, client_sesh and server_proof
    Note over Client: decrypt encrypted_question using password
    Note over Client: user enters answer to decrypted question
    Note over Client: decrypt encrypted_profile using answer
    Note over Client: generate new client_ephem and client_public
    Client->>Profile: profile_id, client_public
    Note over Profile: generate server_ephem using stored verifier and salt
    Note over Profile: derive server_private and server_public keys from server_ephem
    Note over Profile: save server_private and client_public
    Profile->>Client: server_public, salt
    Note over Client: generate new client_sesh from salt, profile_id, answer, client_ephem and server_public
    Note over Client: derive client_proof from client_sesh
    Client->>Profile: profile_id, client_proof
    Note over Profile: generate server_sesh from server_private, client_public, salt, profile_id, verifier and client_proof
    Note over Profile: derive server_proof from server_sesh
    Note over Profile: login verified, return jwt
    Profile->>Client: server_proof, jwt
    Note over Client: verify session using client_ephem, client_sesh and server_proof
    Note over Client: jwt can now be used to authenticate against all other apis
```

## Sign Up
```mermaid
sequenceDiagram
    participant Account
    participant Client
    participant Profile
    participant Account
    Note over Client: user enters email, password, question, answer
    Note over Client: generate salt and verifier using email and password
    Note over Client: encrypt question with password
    Client->>Account: email, verifier, salt, encrypted_question
    Note over Account: save email, verifier, salt and encrypted_question
    Note over Account: generate token, save and send by email
    Note over Client: user reads token from email
    Client->>Account: email, token
    Note over Account: verify token, set account to verified
    Note over Account: generate account_jwt
    alt TODO
        Account->>Client: account_jwt, ???
        Note over Client: ???
        Note over Client: generate salt and verifier using profile_id and security_answer
        Client->>Profile: profile_id, salt, verifier, ???
        Note over Profile: ???
    end
    Note over Profile: save profile_id, salt and verifier
    Note over Client: encrypt profile_id with security_answer
    Client->>Account: encrypted_profile, account_jwt
    Note over Account: verify account_jwt
    Note over Account: update account to save encrypted_profile
```

## Recovery
```mermaid
sequenceDiagram
    participant Account
    participant Client
    participant Profile
    participant Account
    Note over Client: user enters email
    Client->>Account: email
    Note over Account: set account to recovery
    Note over Account: generate token, save and send by email
    Note over Client: user reads token from email
    Note over Client: user enters new password
    Note over Client: generate salt and verifier using email and new password
    alt user remembers question and answer
        Note over Client: user enters question and answer
        Note over Client: encrypt question with new password
        Client->>Account: email, token, salt, verifier, encrypted_question
        Note over Account: verify token
        Note over Account: save salt, verifier and encrypted_question
        Note over Account: set account to recovered
    end
    alt user doesn't remember question or answer
        Note over Client: user enters new question and answer
        Note over Client: encrypt new question with new password
        Client->>Account: email, token, salt, verifier, encrypted_question
        Note over Account: verify token
        Note over Account: save salt, verifier and encrypted_question
        Note over Account: generate account_jwt 
        alt TODO
            Account->>Client: account_jwt, ???
            Note over Client: ???
            Note over Client: generate salt and verifier using profile_id and security_answer
            Client->>Profile: profile_id, salt, verifier, ???
            Note over Profile: ???
        end
        Note over Profile: save profile_id, salt and verifier
        Note over Client: encrypt profile_id with security_answer
        Client->>Account: encrypted_profile, account_jwt
        Note over Account: verify account_jwt
        Note over Account: update account to save encrypted_profile
        Note over Account: set account to recovered
    end
``` 

   
