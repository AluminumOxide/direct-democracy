# API Documentation

## Routes
### GET /v1/democracy

*List democracies*

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

	 - [queries-democracy_sort](#queries-democracy_sort)

- **filter**

	 - [queries-democracy_filter](#queries-democracy_filter)


**Responses**

- [200](#responses-democracy_list)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### GET /v1/democracy/:democracy_id

*Get a democracy*

**Params**

- [democracy_id](#params-democracy_id)

**Responses**

- [200](#responses-democracy_read)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### GET /v1/democracy/root

*Get root democracy*

**Responses**

- [200](#responses-democracy_root)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/population

*Trigger democracy population updates*

**Queries**

Type: object

Additional Properties: false

Properties:

- **time_start**

	 - [queries-time_start](#queries-time_start)

- **time_end**

	 - [queries-time_end](#queries-time_end)


**Responses**

- [200](#responses-200)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/proposal/:proposal_id

*Check if proposal passes and apply*

**Params**

- [proposal_id](#params-proposal_id)

**Responses**

- [200](#responses-200)
- [204](#responses-204)
- [304](#responses-304)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)


## Headers

## Params

#### params-democracy_id

Type: [schemas-democracy_id](#schemas-democracy_id)
#### params-proposal_id

Type: [schemas-proposal_id](#schemas-proposal_id)
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
#### queries-time_start

Type: [schemas-date](#schemas-date)
#### queries-time_end

Type: [schemas-date](#schemas-date)
#### queries-democracy_sort

Type: string

Enum:

- democracy_name
- democracy_population_verified
- democracy_population_unverified
- date_created
- date_updated
#### queries-democracy_filter

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



- **democracy_name**


	One Of:

	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op_string](#schemas-op_string)

	- **val**

		Type: [schemas-democracy_name](#schemas-democracy_name)


	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op_array](#schemas-op_array)

	- **val**

		Type: array

		Items:

		- Type: [schemas-democracy_name](#schemas-democracy_name)



- **democracy_description**


	One Of:

	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op_string](#schemas-op_string)

	- **val**

		Type: [schemas-democracy_description](#schemas-democracy_description)


	- Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op_array](#schemas-op_array)

	- **val**

		Type: array

		Items:

		- Type: [schemas-democracy_description](#schemas-democracy_description)



- **democracy_population_verified**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-democracy_population](#schemas-democracy_population)


- **democracy_population_unverified**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-democracy_population](#schemas-democracy_population)


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



## Bodies

## Responses

#### responses-200


*Success*


#### responses-204


*No Content*


#### responses-304


*Not Modified*


#### responses-400


*Bad Request*


#### responses-401


*Unauthorized*


#### responses-500


*Internal Error*


#### responses-democracy_list


*Successfully return list of democracies*


Type: array

Items:

- Type: [schemas-democracy_list](#schemas-democracy_list)
#### responses-democracy_root


*Successfully fetched a democracy*


Type: [schemas-democracy_root](#schemas-democracy_root)
#### responses-democracy_read


*Successfully fetched a democracy*


Type: [schemas-democracy_read](#schemas-democracy_read)
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
#### schemas-proposal_id


*Proposal ID*


Type: [schemas-uuid](#schemas-uuid)
#### schemas-democracy_id


*Democracy ID*


Type: [schemas-uuid](#schemas-uuid)
#### schemas-democracy_name


*Democracy name*


Type: string
#### schemas-democracy_description


*Democracy description*


Type: string
#### schemas-democracy_population


*Democracy population*


Type: integer
#### schemas-democracy_conduct


*Democracy's code of conduct*


Type: object

Additional Properties:
	Type: string

#### schemas-democracy_content


*Democratically decided content*


Type: object

#### schemas-democracy_parent


*Parent democracy ID*


Type: [schemas-uuid](#schemas-uuid)
#### schemas-democracy_children


*Child democracy IDs*


Type: array

Items:

- Type: [schemas-uuid](#schemas-uuid)
#### schemas-democracy_meta


*Democracy meta rules*


Type: object

Additional Properties: false

Properties:

- **name**


	*Conditions to update democracy name*


	Type: object

	Additional Properties: false

	Properties:

	- **update**

		Type: [schemas-democracy_meta_cond](#schemas-democracy_meta_cond)


- **description**


	*Conditions to update democracy description*


	Type: object

	Additional Properties: false

	Properties:

	- **update**

		Type: [schemas-democracy_meta_cond](#schemas-democracy_meta_cond)


- **democracies**


	*Conditions to add or remove child democracies*


	Type: object

	Additional Properties: false

	Properties:

	- **add**

		Type: [schemas-democracy_meta_cond](#schemas-democracy_meta_cond)

	- **delete**

		Type: [schemas-democracy_meta_cond](#schemas-democracy_meta_cond)


- **members**


	*Conditions to add, remove or update memberships*


	Type: [schemas-democracy_meta_leaf](#schemas-democracy_meta_leaf)

- **timeouts**


	*Conditions to add, remove or update timeouts*


	Type: [schemas-democracy_meta_leaf](#schemas-democracy_meta_leaf)

- **conduct**


	*Conditions to add, remove or update rules of conduct*


	Type: [schemas-democracy_meta_leaf](#schemas-democracy_meta_leaf)

- **content**


	*Conditions to add, remove or update content*


	Type: object


- **meta**


	*Conditions to add, remove or update meta rules*


	Type: [schemas-democracy_meta_leaf](#schemas-democracy_meta_leaf)

#### schemas-democracy_meta_cond


*Democracy meta leaf*


Type: object

Properties:

- **approval_percent_minimum**

	Type: integer

- **approval_number_minimum**

	Type: integer

- **disapproval_percent_maximum**

	Type: integer

- **disapproval_number_maximum**

	Type: integer

- **lifetime_minimum_days**

	Type: integer

- **lifetime_maximum_days**

	Type: integer

#### schemas-democracy_meta_branch


*Meta rules for recursive structures*


Type: object

Additional Properties: false

Pattern Properties:

- **.***


	One Of:

	- Type: [schemas-democracy_meta_leaf](#schemas-democracy_meta_leaf)

	- Type: [schemas-democracy_meta_branch](#schemas-democracy_meta_branch)


#### schemas-democracy_read


*Democracy - Read*


Type: object

Required:

- democracy_id
- democracy_name
- democracy_description
- democracy_parent
- democracy_children
- democracy_population
- democracy_conduct
- democracy_content
- democracy_meta
- date_created
- date_updated

Properties:

- **democracy_id**

	Type: [schemas-democracy_id](#schemas-democracy_id)

- **democracy_name**

	Type: [schemas-democracy_name](#schemas-democracy_name)

- **democracy_description**

	Type: [schemas-democracy_description](#schemas-democracy_description)

- **democracy_parent**

	Type: [schemas-democracy_parent](#schemas-democracy_parent)

- **democracy_children**

	Type: [schemas-democracy_children](#schemas-democracy_children)

- **democracy_population**

	Type: [schemas-democracy_population](#schemas-democracy_population)

- **democracy_conduct**

	Type: [schemas-democracy_conduct](#schemas-democracy_conduct)

- **democracy_content**

	Type: [schemas-democracy_content](#schemas-democracy_content)

- **democracy_meta**

	Type: [schemas-democracy_meta](#schemas-democracy_meta)

- **date_created**

	Type: [schemas-date_created](#schemas-date_created)

- **date_updated**

	Type: [schemas-date_updated](#schemas-date_updated)

#### schemas-democracy_root


*Democracy - Root*


Type: object

Required:

- democracy_id
- democracy_name
- democracy_description
- democracy_population
- democracy_conduct
- democracy_content
- democracy_meta
- date_created
- date_updated

Properties:

- **democracy_id**

	Type: [schemas-democracy_id](#schemas-democracy_id)

- **democracy_name**

	Type: [schemas-democracy_name](#schemas-democracy_name)

- **democracy_description**

	Type: [schemas-democracy_description](#schemas-democracy_description)

- **democracy_population**

	Type: [schemas-democracy_population](#schemas-democracy_population)

- **democracy_conduct**

	Type: [schemas-democracy_conduct](#schemas-democracy_conduct)

- **democracy_content**

	Type: [schemas-democracy_content](#schemas-democracy_content)

- **democracy_meta**

	Type: [schemas-democracy_meta](#schemas-democracy_meta)

- **date_created**

	Type: [schemas-date_created](#schemas-date_created)

- **date_updated**

	Type: [schemas-date_updated](#schemas-date_updated)

#### schemas-democracy_list


*Democracy - List*


Type: object

Required:

- democracy_id
- democracy_name
- democracy_description
- democracy_population
- date_created
- date_updated

Properties:

- **democracy_id**

	Type: [schemas-democracy_id](#schemas-democracy_id)

- **democracy_name**

	Type: [schemas-democracy_name](#schemas-democracy_name)

- **democracy_description**

	Type: [schemas-democracy_description](#schemas-democracy_description)

- **democracy_population**

	Type: [schemas-democracy_population](#schemas-democracy_population)

- **date_created**

	Type: [schemas-date_created](#schemas-date_created)

- **date_updated**

	Type: [schemas-date_updated](#schemas-date_updated)
