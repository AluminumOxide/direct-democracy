# API Documentation

## Routes
### GET /v1/jwt/verify

*Verify JWT issued by this service*

**Responses**

- [200]
Type: object

- [401](#responses-401)
- [500](#responses-500)

### GET /v1/membership

*List memberships*

**Queries**

Type: object

Properties:

- **limit**

	 - [queries-limit](#queries-limit)

- **last**

	 - [queries-last](#queries-last)

- **order**

	 - [queries-order](#queries-order)

- **sort**

	 - [queries-membership_sort](#queries-membership_sort)

- **filter**

	 - [queries-membership_filter](#queries-membership_filter)


**Responses**

- [200](#responses-membership_list)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/membership

*Create a membership*

**Bodies**

 - [bodies-membership_create](#bodies-membership_create)

**Responses**

- [200](#responses-membership_read)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### GET /v1/membership/:membership_id

*Get a membership*

**Params**

- [membership_id](#params-membership_id)

**Responses**

- [200](#responses-membership_read)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### DELETE /v1/membership/:membership_id

*Delete a membership*

**Queries**

Type: object

Properties:

- **profile_id**

	 - [queries-profile_id](#queries-profile_id)


**Params**

- [membership_id](#params-membership_id)

**Responses**

- [204](#responses-204)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### GET /v1/membership/:membership_id/verify

*Verify a membership*

**Params**

- [membership_id](#params-membership_id)

**Responses**

- [200](#schemas-membership_read)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/membership/:membership_id/verify

*Set membership to verifying*

**Params**

- [membership_id](#params-membership_id)

**Bodies**

 - [bodies-membership_verifying](#bodies-membership_verifying)

**Responses**

- [200](#schemas-membership_read)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### DELETE /v1/membership/:membership_id/verify

*Unverify a membership*

**Params**

- [membership_id](#params-membership_id)

**Responses**

- [200](#schemas-membership_read)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/democracy/:democracy_id/members

*Mass create memberships for a new democracy*

**Params**

- [democracy_id](#params-democracy_id)

**Bodies**

 - [bodies-democracy_members](#bodies-democracy_members)

**Responses**

- [200](#responses-201)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### GET /v1/population

*Fetch democracy populations*

**Queries**

Type: object

Properties:

- **limit**

	 - [queries-limit](#queries-limit)

- **last**

	 - [queries-population_last](#queries-population_last)

- **order**

	 - [queries-order](#queries-order)

- **sort**

	 - [queries-population_sort](#queries-population_sort)

- **filter**

	 - [queries-population_filter](#queries-population_filter)


**Responses**

- [200](#responses-population_list)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)


## Headers

## Params

#### params-membership_id

Type: [schemas-membership_id](#schemas-membership_id)
#### params-democracy_id

Type: [schemas-democracy_id](#schemas-democracy_id)
## Queries

#### queries-limit

Type: integer
#### queries-last

Type: string
#### queries-population_last

Type: [schemas-uuid](#schemas-uuid)
#### queries-order

Type: string

Enum:

- ASC
- DESC
#### queries-membership_sort

Type: string

Enum:

- membership_id
- date_created
- date_updated
#### queries-population_sort

Type: string

Enum:

- democracy_id
- population
- date_updated
#### queries-profile_id

Type: [schemas-profile_id](#schemas-profile_id)
#### queries-membership_filter

Type: object

Additional Properties: false

Properties:

- **democracy_id**


	One Of:

	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-democracy_id](#schemas-democracy_id)


	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op_array](#schemas-op_array)

	- **val**

		Type: array

		Items:

		- Type: [schemas-democracy_id](#schemas-democracy_id)



- **profile_id**


	One Of:

	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-profile_id](#schemas-profile_id)


	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op_array](#schemas-op_array)

	- **val**

		Type: array

		Items:

		- Type: [schemas-profile_id](#schemas-profile_id)



- **is_verified**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op_bool](#schemas-op_bool)

	- **val**

		Type: [schemas-is_verified](#schemas-is_verified)


- **date_created**


	One Of:

	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-date_created](#schemas-date_created)


	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op_array](#schemas-op_array)

	- **val**

		Type: array

		Items:

		- Type: [schemas-date_created](#schemas-date_created)



- **date_updated**


	One Of:

	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-date_updated](#schemas-date_updated)


	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op_array](#schemas-op_array)

	- **val**

		Type: array

		Items:

		- Type: [schemas-date_updated](#schemas-date_updated)



#### queries-population_filter

Type: object

Additional Properties: false

Properties:

- **democracy_id**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**


		One Of:

		- Type: [schemas-democracy_id](#schemas-democracy_id)

		- Type: array

			Items:

			- Type: [schemas-democracy_id](#schemas-democracy_id)



- **population_verified**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**


		One Of:

		- Type: integer

		- Type: array

			Items:

			- Type: integer



- **population_unverified**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**


		One Of:

		- Type: integer

		- Type: array

			Items:

			- Type: integer



- **date_updated**


	One Of:

	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-date_updated](#schemas-date_updated)


	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op_array](#schemas-op_array)

	- **val**

		Type: array

		Items:

		- Type: [schemas-date_updated](#schemas-date_updated)



## Bodies

#### bodies-membership_create

Type: [schemas-membership_create](#schemas-membership_create)
#### bodies-membership_verifying

Type: [schemas-membership_verifying](#schemas-membership_verifying)
#### bodies-democracy_members

Type: [schemas-democracy_members](#schemas-democracy_members)
## Responses

#### responses-201


*Successfully Created*


#### responses-204


*Successfully Deleted*


#### responses-400


*Bad Request*


#### responses-401


*Unauthorized*


#### responses-500


*Internal Error*


#### responses-membership_list


*Successfully return list of memberships*


Type: array

Items:

- Type: [schemas-membership_list](#schemas-membership_list)
#### responses-membership_read


*Successfully fetched a membership*


Type: [schemas-membership_read](#schemas-membership_read)
#### responses-population_list


*Democracy populations from memberships*


Type: [schemas-population_list](#schemas-population_list)
## Data

#### schemas-op

Type: string

Enum:

- =
- !=
- \>=
- \>
- <=
- <
#### schemas-op_bool

Type: string

Enum:

- =
- !=
#### schemas-op_string

Type: string

Enum:

- =
- !=
- \>=
- \>
- <=
- <
- ~
#### schemas-op_array

Type: string

Enum:

- IN
- NOT IN
- BETWEEN
- XBETWEEN
#### schemas-uuid

Type: string

Pattern: ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
#### schemas-date

Type: string

Pattern: ^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$
#### schemas-date_created

Type: [schemas-date](#schemas-date)
#### schemas-date_updated

Type: [schemas-date](#schemas-date)
#### schemas-membership_id


*Membership ID*


Type: [schemas-uuid](#schemas-uuid)
#### schemas-democracy_id


*Democracy ID*


Type: [schemas-uuid](#schemas-uuid)
#### schemas-profile_id


*Profile ID*


Type: [schemas-uuid](#schemas-uuid)
#### schemas-proposal_id


*Proposal ID*


Type: [schemas-uuid](#schemas-uuid)
#### schemas-is_verified


*Is the membership verified?*


Type: boolean
#### schemas-is_verifying


*Is the membership in the process of verifying?*


Type: boolean
#### schemas-membership_read


*Membership - Read*


Type: object

Required:

- membership_id
- democracy_id
- profile_id
- is_verified
- is_verifying
- date_created
- date_updated

Properties:

- **membership_id**

	Type: [schemas-membership_id](#schemas-membership_id)

- **democracy_id**

	Type: [schemas-democracy_id](#schemas-democracy_id)

- **profile_id**

	Type: [schemas-profile_id](#schemas-profile_id)

- **is_verified**

	Type: [schemas-is_verified](#schemas-is_verified)

- **is_verifying**

	Type: [schemas-is_verifying](#schemas-is_verifying)

- **date_created**

	Type: [schemas-date_created](#schemas-date_created)

- **date_updated**

	Type: [schemas-date_updated](#schemas-date_updated)

#### schemas-membership_list


*Membership - List*


Type: object

Required:

- membership_id
- democracy_id
- profile_id
- is_verified
- date_created
- date_updated

Properties:

- **membership_id**

	Type: [schemas-membership_id](#schemas-membership_id)

- **democracy_id**

	Type: [schemas-democracy_id](#schemas-democracy_id)

- **profile_id**

	Type: [schemas-profile_id](#schemas-profile_id)

- **is_verified**

	Type: [schemas-is_verified](#schemas-is_verified)

- **date_created**

	Type: [schemas-date_created](#schemas-date_created)

- **date_updated**

	Type: [schemas-date_updated](#schemas-date_updated)

#### schemas-membership_create


*Membership - Create*


Type: object

Required:

- democracy_id
- profile_id

Properties:

- **democracy_id**

	Type: [schemas-democracy_id](#schemas-democracy_id)

- **profile_id**

	Type: [schemas-profile_id](#schemas-profile_id)

#### schemas-membership_verifying


*Set membership to verifying*


Type: object

Required:

- proposal_id

Properties:

- **proposal_id**

	Type: [schemas-proposal_id](#schemas-proposal_id)

#### schemas-democracy_members


*Democracy - Members*


Type: object

Required:

- members

Properties:

- **members**

	Type: array

	Items:

	- Type: [schemas-membership_id](#schemas-membership_id)

#### schemas-population_list


*Population - List*


Type: array

Items:

- Type: object

Properties:

- **democracy_id**

	Type: [schemas-democracy_id](#schemas-democracy_id)

- **population**

	Type: integer
