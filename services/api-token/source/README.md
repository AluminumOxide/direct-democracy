# API Documentation

## Routes
### POST /v1/fill

*Fill token buckets*

**Bodies**

 - [bodies-fill](#bodies-fill)

**Responses**

- [200](#responses-200)
- [400](#responses-400)
- [500](#responses-500)

### POST /v1/step/one

*Step 1*

**Bodies**

 - [bodies-step_one](#bodies-step_one)

**Responses**

- [200](#responses-step_one)
- [400](#responses-400)
- [500](#responses-500)

### POST /v1/step/two

*Step 2*

**Bodies**

 - [bodies-step_two](#bodies-step_two)

**Responses**

- [200](#responses-step_two)
- [400](#responses-400)
- [500](#responses-500)

### POST /v1/step/three

*Step 3*

**Bodies**

 - [bodies-step_three](#bodies-step_three)

**Responses**

- [200](#responses-step_three)
- [400](#responses-400)
- [500](#responses-500)


## Headers

## Params

## Queries

## Bodies

#### bodies-fill

Type: object

Additional Properties: false

Properties:

- **bucket_size**

	Type: integer

#### bodies-step_one

Type: object

Required:

- pke_key

Additional Properties: false

Properties:

- **pke_key**

	Type: [schemas-pke_key](#schemas-pke_key)

#### bodies-step_two

Type: object

Required:

- pke_key
- pake_key
- encrypted_id

Additional Properties: false

Properties:

- **pke_key**

	Type: [schemas-pke_key](#schemas-pke_key)

- **pake_key**

	Type: [schemas-pake_key](#schemas-pake_key)

- **encrypted_id**

	Type: [schemas-encrypted_id](#schemas-encrypted_id)

#### bodies-step_three

Type: object

Required:

- pake_key
- pake_proof

Additional Properties: false

Properties:

- **pake_key**

	Type: [schemas-pake_key](#schemas-pake_key)

- **pake_proof**

	Type: [schemas-pake_proof](#schemas-pake_proof)

## Responses

#### responses-200


*Success*


#### responses-400


*Bad Request*


#### responses-500


*Internal Error*


#### responses-sign_one


*Successfully completed step one*


Type: object

Additional Properties: false

Properties:

- **pke_key**

	Type: [schemas-pke_key](#schemas-pke_key)

#### responses-sign_two


*Successfully completed step two*


Type: object

Additional Properties: false

Properties:

- **pake_key**

	Type: [schemas-pake_key](#schemas-pake_key)

- **salt**

	Type: [schemas-salt](#schemas-salt)

#### responses-sign_three


*Successfully completed step three*


Type: object

Additional Properties: false

Properties:

- **encrypted_token**

	Type: [schemas-encrypted_token](#schemas-encrypted_token)

- **pake_proof**

	Type: [schemas-pake_proof](#schemas-pake_proof)

## Data

#### schemas-uuid

Type: string

Pattern: ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
#### schemas-salt

Type: string
#### schemas-pke_key

Type: string
#### schemas-pake_key

Type: string
#### schemas-pake_proof

Type: string
#### schemas-encrypted_id

Type: string
#### schemas-encrypted_token

Type: string