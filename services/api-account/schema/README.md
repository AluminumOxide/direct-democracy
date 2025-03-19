# DB Documentation

## Tables

### Account
| Field | Type | Description |
| -- | -- | -- |
| id                    | UUID      | ID of the account |
| email                 | VARCHAR   | Account email |
| email_token           | VARCHAR   | Email token for verification |
| auth_zkpp             | VARCHAR   | Authorization ZKPP |
| auth_salt             | VARCHAR   | Authorization salt |
| auth_public           | VARCHAR   | Client's public key |
| auth_private          | VARCHAR   | Server's private key |
| encrypt_question      | VARCHAR   | Encrypted security question |
| encrypt_profile       | VARCHAR   | Encrypted profile ID |
| is_verified           | BOOLEAN   | Is the account verified? |
| date_created          | TIMESTAMP | Date the account was created |
| date_updated          | TIMESTAMP | Date the account was last updated |


### Token
| Field | Type | Description |
| -- | -- | -- |
| id                    | UUID      | ID of the token |
| bucket                | VARCHAR   | Token bucket |
| token                 | VARCHAR   | Token value |
| date_created          | TIMESTAMP | Date the token was created |
| date_updated          | TIMESTAMP | Date the token was last updated |
