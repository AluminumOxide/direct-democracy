# Membership Service

## Overview

### Domain Diagram
```mermaid
flowchart RL
    D[Democracy]:::exclude
    M[Membership] --> D
    P --> D
    P[Proposal]:::exclude --> M
    B[Ballot]:::exclude --> P
    B --> M
    classDef exclude opacity:0.5
```

## APIs
TODO

## Data
### Membership
| Field | Type | Description |
| -- | -- | -- |
| id                    | UUID      | ID of the membership |
| profile_id            | UUID      | ID of the membership's profile |
| is_verified           | BOOLEAN   | If the membership has been verified |
| date_created          | TIMESTAMP | Date the democracy was created |
| date_updated          | TIMESTAMP | Date the democracy was last updated |

