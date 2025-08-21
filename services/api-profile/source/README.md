# API Documentation

## Routes
### GET /v1/jwt/verify

*Verify JWT issued by this service*

**Responses**

- [200]
Type: object

- [401](#responses-401)
- [500](#responses-500)

### POST /v1/sign/in

*Initiate sign in*

**Bodies**

 - [bodies-sign_in_init](#bodies-sign_in_init)

**Responses**

- [200](#responses-sign_in_init)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/sign/in/finish

*Finish sign in*

**Bodies**

 - [bodies-sign_in_finish](#bodies-sign_in_finish)

**Responses**

- [200](#responses-sign_in_finish)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/sign/in/verify

*Verify sign in*

**Responses**

- [200](#responses-sign_in_verify)
- [400](#responses-400)
- [500](#responses-500)

### POST /v1/sign/out

*Sign out*

**Responses**

- [200](#responses-200)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/sign/up

*Sign up*

**Bodies**

 - [bodies-sign_up](#bodies-sign_up)

**Responses**

- [200](#responses-sign_up)
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

#### headers-jwt

Type: string
## Params

## Queries

## Bodies

#### bodies-sign_in_init

Type: [schemas-sign_in_init](#schemas-sign_in_init)
#### bodies-sign_in_finish

Type: [schemas-sign_in_finish](#schemas-sign_in_finish)
#### bodies-sign_in_verify

Type: [schemas-sign_in_verify](#schemas-sign_in_verify)
#### bodies-sign_up

Type: [schemas-sign_up](#schemas-sign_up)
#### bodies-sign_out

Type: [schemas-sign_out](#schemas-sign_out)
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

	- signup
	- profile

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


#### responses-sign_up


*Successfully signed up*


Type: object

Properties:

- **token**

	Type: string

#### responses-sign_in_init


*Successfully completed first sign in step*


Type: object

Additional Properties: false

Properties:

- **key**

	Type: string

- **salt**

	Type: string

#### responses-sign_in_finish


*Successfully completed sign in*


Type: object

Additional Properties: false

Properties:

- **proof**

	Type: string

- **jwt**

	Type: [schemas-jwt](#schemas-jwt)

#### responses-sign_in_verify


*Sign in verified*


Type: object

Additional Properties: false

Properties:

- **profile_id**

	Type: string

## Data

#### schemas-token

Type: string
#### schemas-sign_in_init

Type: object

Additional Properties: false

Properties:

- **profile_id**

	Type: string

- **key**

	Type: string

#### schemas-sign_in_finish

Type: object

Additional Properties: false

Properties:

- **profile_id**

	Type: string

- **key**

	Type: string

#### schemas-sign_up

Type: object

Additional Properties: false

Properties:

- **profile_id**

	Type: string

- **profile_token**

	Type: string

- **zkpp**

	Type: string

- **salt**

	Type: string

#### schemas-jwt

Type: string
#### schemas-sign_out

Type: object

Additional Properties: false

Properties:

- **jwt**

	Type: [schemas-jwt](#schemas-jwt)

#### schemas-sign_in_verify

Type: object

Additional Properties: false

Properties:

- **jwt**

	Type: [schemas-jwt](#schemas-jwt)
