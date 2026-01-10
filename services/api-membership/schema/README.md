# DB Documentation

## Tables

### Membership
| Field | Type | Description |
| -- | -- | -- |
| id                    | UUID      | ID of the membership |
| profile_id            | UUID      | ID of the membership's profile |
| is_verified           | BOOLEAN   | If the membership has been verified |
| is_verifying          | BOOLEAN   | If the membership is being verified |
| verify_proposal       | UUID      | ID of the proposal to verify member |
| date_created          | TIMESTAMP | Date the democracy was created |
| date_updated          | TIMESTAMP | Date the democracy was last updated |
