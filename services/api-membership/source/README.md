# API Documentation

## Routes
### GET /v1/membership

*List memberships*

**Queries**

- [limit](#queries-limit)
- [last](#queries-last)
- [order](#queries-order)
- [sort](#queries-membership_sort)
- [filter](#queries-membership_filter)

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

- [profile_id](#queries-profile_id)

**Params**

- [membership_id](#params-membership_id)

**Responses**

- [204](#responses-204)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### GET /v1/population

*Fetch democracy populations*

**Queries**

- [limit](#queries-limit)
- [last](#queries-last)
- [order](#queries-order)
- [sort](#queries-population_sort)
- [filter](#queries-population_filter)

**Responses**

- [200](#responses-population_list)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)


## Headers

## Params

#### params-membership_id

Type: [schemas-membership_id](#schemas-membership_id)
## Queries

#### queries-limit

Type: integer
#### queries-last

Type: string
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



- **profile_id**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**


		One Of:

		- Type: [schemas-profile_id](#schemas-profile_id)

		- Type: array

			Items:

			- Type: [schemas-profile_id](#schemas-profile_id)



- **is_verified**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-is_verified](#schemas-is_verified)


- **date_created**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**


		One Of:

		- Type: [schemas-date_created](#schemas-date_created)

		- Type: array

			Items:

			- Type: [schemas-date_created](#schemas-date_created)



- **date_updated**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**


		One Of:

		- Type: [schemas-date_updated](#schemas-date_updated)

		- Type: array

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



- **population**

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

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**


		One Of:

		- Type: [schemas-date_updated](#schemas-date_updated)

		- Type: array

			Items:

			- Type: [schemas-date_updated](#schemas-date_updated)



## Bodies

#### bodies-membership_create

Type: [schemas-membership_create](#schemas-membership_create)
## Responses

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
#### schemas-is_verified


*Is the membership verified?*


Type: boolean
#### schemas-membership_read


*Membership - Read*


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
