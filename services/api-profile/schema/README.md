# DB Documentation

## Tables

### Profile
| Field | Type | Description |
| -- | -- | -- |
| id                    | UUID      | ID of the profile |
| auth_zkpp             | VARCHAR   | Authorization zkpp |
| auth_salt             | VARCHAR   | Authorization salt |
| auth_public           | VARCHAR   | Authorization client public key |
| auth_private          | VARCHAR   | Authorization server private key |
| auth_token            | VARCHAR   | Authorization token for jwt |
| auth_expiry           | TIMESTAMP | Authorization expiry for jwt |
| date_created          | TIMESTAMP | Date the profile was created |
| date_updated          | TIMESTAMP | Date the profile was last updated |


### Token
| Field | Type | Description |
| -- | -- | -- |
| id                    | UUID      | ID of the token |
| bucket                | VARCHAR   | Token bucket |
| token                 | VARCHAR   | Token value |
| date_created          | TIMESTAMP | Date the token was created |
| date_updated          | TIMESTAMP | Date the token was last updated |

