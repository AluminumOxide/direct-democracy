# API Documentation

## Routes
### GET /v1/jwt/verify

*Verify JWT issued by this service*

**Responses**

- [200]
Type: object

- [401](#responses-401)
- [500](#responses-500)

### POST /v1/signin

*Initiate sign in*

**Bodies**

 - [bodies-sign_in_init](#bodies-sign_in_init)

**Responses**

- [200](#responses-sign_in_init)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/signin/verify

*Verify sign in*

**Bodies**

 - [bodies-sign_in_verify](#bodies-sign_in_verify)

**Responses**

- [200](#responses-sign_in_verify)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/signup

*Sign up*

**Bodies**

 - [bodies-sign_up_init](#bodies-sign_up_init)

**Responses**

- [200](#responses-200)
- [400](#responses-400)
- [500](#responses-500)

### POST /v1/signup/verify

*Verify email*

**Bodies**

 - [bodies-sign_up_verify](#bodies-sign_up_verify)

**Responses**

- [200](#responses-200)
- [400](#responses-400)
- [500](#responses-500)

### POST /v1/bucket/fill

*Fill tokens bucket*

**Bodies**

 - [bodies-fill_bucket](#bodies-fill_bucket)

**Responses**

- [200](#responses-200)
- [401](#responses-401)
- [500](#responses-500)


## Headers

## Params

## Queries

## Bodies

#### bodies-sign_in_init

Type: [schemas-sign_in_init](#schemas-sign_in_init)
#### bodies-sign_in_verify

Type: [schemas-sign_in_verify](#schemas-sign_in_verify)
#### bodies-sign_up_init

Type: [schemas-sign_up_init](#schemas-sign_up_init)
#### bodies-sign_up_verify

Type: [schemas-sign_up_verify](#schemas-sign_up_verify)
#### bodies-fill_bucket

Type: object

Required:

- bucket
- tokens

Additional Properties: false

Properties:

- **bucket**

	Type: string

	Enum:

	- email
	- account

- **tokens**

	Type: array

	Items:

	- Type: [schemas-token](#schemas-token)

## Responses

#### responses-200


*Success*


#### responses-400


*Bad Request*


#### responses-401


*Unauthorized*


#### responses-500


*Internal Error*


#### responses-sign_in_init


*Successfully completed first sign in step*


Type: object

Additional Properties: false

Properties:

- **salt**

	Type: string

- **key**

	Type: string

#### responses-sign_in_verify


*Successfully completed sign in*


Type: string
## Data

#### schemas-sign_in_init

Type: object

Additional Properties: false

Properties:

- **email**

	Type: string

- **key**

	Type: string

#### schemas-sign_in_verify

Type: object

Additional Properties: false

Properties:

- **email**

	Type: string

- **key**

	Type: string

#### schemas-sign_up_init

Type: object

Additional Properties: false

Properties:

- **email**

	Type: string

- **zkpp**

	Type: string

- **salt**

	Type: string

- **encrypted_question**

	Type: string

#### schemas-sign_up_verify

Type: object

Additional Properties: false

Properties:

- **email_token**

	Type: string

- **account_token**

	Type: string

- **encrypted_profile**

	Type: string

#### schemas-token

Type: string