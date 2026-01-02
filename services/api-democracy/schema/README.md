# DB Documentation

## Tables

### Democracy
| Field | Type | Description |
| -- | -- | -- |
| id                    | UUID      | ID of the democracy |
| parent_id             | UUID      | ID of parent the democracy |
| democracy_name        | VARCHAR   | Name of the democracy |
| democracy_description | VARCHAR   | Description of the democracy |
| population_verified   | INT       | Verified population of the democracy |
| population_unverified | INT       |  Unverified population of the democracy |
| democracy_conduct     | JSONB     | Code of conduct of the democracy |
| democracy_content     | JSONB     | Content decided by the democracy members |
| democracy_metas       | JSONB     | Rules for modification of the democracy |
| date_created          | TIMESTAMP | Date the democracy was created |
| date_updated          | TIMESTAMP | Date the democracy was last updated |


