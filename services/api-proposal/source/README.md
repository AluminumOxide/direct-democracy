# API Documentation

## Routes
### POST /v1/verified

*Update ballot verified statuses*

**Responses**

- [200](#responses-ballot_verified)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### GET /v1/proposal

*List proposals*

**Queries**


Any Of:

 - [queries-proposal_sort_string](#queries-proposal_sort_string)

 - [queries-proposal_sort_date](#queries-proposal_sort_date)


**Responses**

- [200](#responses-proposal_list)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/proposal

*Create a proposal*

**Bodies**

 - [bodies-proposal_create](#bodies-proposal_create)

**Responses**

- [201](#responses-proposal_create)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### GET /v1/proposal/:proposal_id

*Read a proposal*

**Params**

- [proposal_id](#params-proposal_id)

**Responses**

- [200](#responses-proposal_read)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/proposal/:proposal_id

*Close a proposal*

**Params**

- [proposal_id](#params-proposal_id)

**Bodies**

 - [bodies-proposal_close](#bodies-proposal_close)

**Responses**

- [200](#responses-proposal_close)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### DELETE /v1/proposal/:proposal_id

*Delete a proposal*

**Params**

- [proposal_id](#params-proposal_id)

**Responses**

- [204](#responses-proposal_delete)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### GET /v1/proposal/:proposal_id/ballot

*List ballots*

**Queries**

 - [queries-ballot_sort](#queries-ballot_sort)

**Params**

- [proposal_id](#params-proposal_id)

**Responses**

- [200](#responses-ballot_list)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/proposal/:proposal_id/ballot

*Create a ballot*

**Params**

- [proposal_id](#params-proposal_id)

**Bodies**

 - [bodies-ballot_create](#bodies-ballot_create)

**Responses**

- [201](#responses-ballot_create)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### GET /v1/proposal/:proposal_id/ballot/:ballot_id

*Read a ballot*

**Params**

- [proposal_id](#params-proposal_id)
- [ballot_id](#params-ballot_id)

**Responses**

- [200](#responses-ballot_read)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/proposal/:proposal_id/ballot/:ballot_id

*Edit a ballot*

**Params**

- [proposal_id](#params-proposal_id)
- [ballot_id](#params-ballot_id)

**Bodies**

 - [bodies-ballot_update](#bodies-ballot_update)

**Responses**

- [200](#responses-ballot_update)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### DELETE /v1/proposal/:proposal_id/ballot/:ballot_id

*Delete a ballot*

**Params**

- [proposal_id](#params-proposal_id)
- [ballot_id](#params-ballot_id)

**Responses**

- [204](#responses-ballot_delete)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)


## Headers

## Params

#### params-proposal_id

Type: [schemas-proposal_id](#schemas-proposal_id)
#### params-ballot_id

Type: [schemas-ballot_id](#schemas-ballot_id)
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
#### queries-proposal_sort

Type: string

Enum:

- proposal_name
- date_created
- date_updated
#### queries-proposal_sort_date

Type: object

Properties:

- **limit**

	Type: [queries-limit](#queries-limit)

- **order**

	Type: [queries-order](#queries-order)

- **filter**

	Type: [queries-proposal_filter](#queries-proposal_filter)

- **sort**

	Type: string

	Enum:

	- date_created
	- date_updated

- **last**

	Type: [schemas-date](#schemas-date)

#### queries-proposal_sort_string

Type: object

Properties:

- **limit**

	Type: [queries-limit](#queries-limit)

- **order**

	Type: [queries-order](#queries-order)

- **filter**

	Type: [queries-proposal_filter](#queries-proposal_filter)

- **sort**

	Type: string

	Enum:

	- proposal_name

- **last**

	Type: string

#### queries-ballot_order

Type: object

Properties:

- **limit**

	Type: [queries-limit](#queries-limit)

- **order**

	Type: [queries-order](#queries-order)

- **filter**

	Type: [queries-ballot_filter](#queries-ballot_filter)

- **sort**

	Type: [queries-proposal_sort](#queries-proposal_sort)

- **last**

	Type: [queries-last](#queries-last)

#### queries-proposal_filter

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

		Type: [schemas-democracy_id](#schemas-democracy_id)


- **membership_id**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-membership_id](#schemas-membership_id)


- **proposal_name**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-proposal_name](#schemas-proposal_name)


- **proposal_description**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: string

		Enum:

		- ~

	- **val**

		Type: [schemas-proposal_description](#schemas-proposal_description)


- **proposal_target**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-proposal_target](#schemas-proposal_target)


- **proposal_votes_yes**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: integer


- **proposal_votes_no**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: integer


- **proposal_votable**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: string

		Enum:

		- =

	- **val**

		Type: boolean


- **proposal_passed**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: string

		Enum:

		- =

	- **val**

		Type: boolean


- **date_created**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-date_created](#schemas-date_created)


- **date_updated**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-date_updated](#schemas-date_updated)


#### queries-ballot_sort

Type: object

Properties:

- **limit**

	Type: [queries-limit](#queries-limit)

- **order**

	Type: [queries-order](#queries-order)

- **filter**

	Type: [queries-ballot_filter](#queries-ballot_filter)

- **sort**

	Type: string

	Enum:

	- date_created
	- date_updated

- **last**

	Type: [schemas-date](#schemas-date)

#### queries-ballot_filter

Type: object

Properties:

- **membership_id**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-membership_id](#schemas-membership_id)


- **ballot_approved**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: string

		Enum:

		- =

	- **val**

		Type: boolean


- **ballot_comments**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: string

		Enum:

		- ~

	- **val**

		Type: [schemas-ballot_comments](#schemas-ballot_comments)


- **date_created**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-date_created](#schemas-date_created)


- **date_updated**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: [schemas-date_updated](#schemas-date_updated)


## Bodies

#### bodies-proposal_create

Type: [schemas-proposal_create](#schemas-proposal_create)
#### bodies-proposal_close

Type: [schemas-proposal_close](#schemas-proposal_close)
#### bodies-ballot_create

Type: [schemas-ballot_create](#schemas-ballot_create)
#### bodies-ballot_update

Type: [schemas-ballot_update](#schemas-ballot_update)
## Responses

#### responses-400


*Bad Request*


#### responses-401


*Unauthorized*


#### responses-500


*Internal Error*


#### responses-proposal_list


*Successfully return list of proposals*


Type: array

Items:

- Type: [schemas-proposal_read](#schemas-proposal_read)
#### responses-proposal_create


*Successfully created a proposal*


Type: [schemas-proposal_read](#schemas-proposal_read)
#### responses-proposal_read


*Successfully fetched a proposal*


Type: [schemas-proposal_read](#schemas-proposal_read)
#### responses-proposal_close


*Successfully closed a proposal*


#### responses-proposal_delete


*Successfully deleted a proposal*


#### responses-ballot_list


*Successfully return list of ballots*


Type: array

Items:

- Type: [schemas-ballot_read](#schemas-ballot_read)
#### responses-ballot_create


*Successfully created a ballot*


Type: [schemas-ballot_read](#schemas-ballot_read)
#### responses-ballot_read


*Successfully fetched a ballot*


Type: [schemas-ballot_read](#schemas-ballot_read)
#### responses-ballot_update


*Successfully updated a ballot*


Type: [schemas-ballot_read](#schemas-ballot_read)
#### responses-ballot_verified


*Successfully updated ballot verification statuses*


#### responses-ballot_delete


*Successfully deleted a ballot*


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
#### schemas-democracy_id


*Democracy ID*


Type: [schemas-uuid](#schemas-uuid)
#### schemas-membership_id


*Membership ID*


Type: [schemas-uuid](#schemas-uuid)
#### schemas-proposal_id


*Proposal ID*


Type: [schemas-uuid](#schemas-uuid)
#### schemas-proposal_name


*Proposal name*


Type: string
#### schemas-proposal_description


*Proposal description*


Type: string
#### schemas-proposal_target


*Proposal target*


Type: string
#### schemas-proposal_votable


*Proposal is votable*


Type: string
#### schemas-proposal_votes


*Proposal votes*


Type: object

Properties:

- **yes**

	Type: integer

- **no**

	Type: integer

#### schemas-proposal_changes


*Proposal changes*


Type: object

Additional Properties:
	Type: [schemas-proposal_changes](#schemas-proposal_changes)

Properties:

- **_add**

	Type: object


- **_update**

	Type: object


- **_delete**

	Type: array

	Items:

	- Type: string

#### schemas-proposal_read


*Proposal - Read*


Type: object

Required:

- proposal_id
- democracy_id
- membership_id
- proposal_name
- proposal_description
- proposal_target
- proposal_changes
- proposal_votable
- proposal_passed
- date_created
- date_updated

Properties:

- **proposal_id**

	Type: [schemas-proposal_id](#schemas-proposal_id)

- **democracy_id**

	Type: [schemas-democracy_id](#schemas-democracy_id)

- **membership_id**

	Type: [schemas-membership_id](#schemas-membership_id)

- **proposal_name**

	Type: [schemas-proposal_name](#schemas-proposal_name)

- **proposal_description**

	Type: [schemas-proposal_description](#schemas-proposal_description)

- **proposal_target**

	Type: [schemas-proposal_target](#schemas-proposal_target)

- **proposal_changes**

	Type: [schemas-proposal_changes](#schemas-proposal_changes)

- **proposal_votes**

	Type: [schemas-proposal_votes](#schemas-proposal_votes)

- **proposal_votable**

	Type: [schemas-proposal_votable](#schemas-proposal_votable)

- **proposal_passed**

	Type: [schemas-proposal_passed](#schemas-proposal_passed)

- **date_created**

	Type: [schemas-date_created](#schemas-date_created)

- **date_updated**

	Type: [schemas-date_updated](#schemas-date_updated)

#### schemas-proposal_create


*Proposal - Create*


Type: object

Required:

- democracy_id
- membership_id
- proposal_name
- proposal_description
- proposal_target
- proposal_changes

Additional Properties: false

Properties:

- **democracy_id**

	Type: [schemas-democracy_id](#schemas-democracy_id)

- **membership_id**

	Type: [schemas-membership_id](#schemas-membership_id)

- **proposal_name**

	Type: [schemas-proposal_name](#schemas-proposal_name)

- **proposal_description**

	Type: [schemas-proposal_description](#schemas-proposal_description)

- **proposal_target**

	Type: [schemas-proposal_target](#schemas-proposal_target)

- **proposal_changes**

	Type: [schemas-proposal_changes](#schemas-proposal_changes)

#### schemas-proposal_close


*Proposal - Close*


Type: object

Required:

- passed

Additional Properties: false

Properties:

- **passed**

	Type: boolean

#### schemas-ballot_id


*Ballot ID*


Type: [schemas-uuid](#schemas-uuid)
#### schemas-ballot_approved


*Do you approve the proposal?*


Type: boolean
#### schemas-ballot_comments


*Ballot comments*


Type: string
#### schemas-ballot_modifiable


*Can the ballot be updated?*


Type: boolean
#### schemas-ballot_read


*Ballot - Read*


Type: object

Required:

- ballot_id
- proposal_id
- membership_id
- ballot_approved
- ballot_comments
- ballot_modifiable
- date_created
- date_updated

Properties:

- **ballot_id**

	Type: [schemas-ballot_id](#schemas-ballot_id)

- **proposal_id**

	Type: [schemas-proposal_id](#schemas-proposal_id)

- **membership_id**

	Type: [schemas-membership_id](#schemas-membership_id)

- **ballot_approved**

	Type: [schemas-ballot_approved](#schemas-ballot_approved)

- **ballot_comments**

	Type: [schemas-ballot_comments](#schemas-ballot_comments)

- **ballot_modifiable**

	Type: [schemas-ballot_modifiable](#schemas-ballot_modifiable)

- **date_created**

	Type: [schemas-date_created](#schemas-date_created)

- **date_updated**

	Type: [schemas-date_updated](#schemas-date_updated)

#### schemas-ballot_create


*Ballot - Create*


Type: object

Required:

- membership_id
- ballot_approved

Additional Properties: false

Properties:

- **membership_id**

	Type: [schemas-membership_id](#schemas-membership_id)

- **ballot_approved**

	Type: [schemas-ballot_approved](#schemas-ballot_approved)

- **ballot_comments**

	Type: [schemas-ballot_comments](#schemas-ballot_comments)

#### schemas-ballot_update


*Ballot - Update*


Type: object

Required:

- membership_id
- ballot_approved

Properties:

- **membership_id**

	Type: [schemas-membership_id](#schemas-membership_id)

- **ballot_approved**

	Type: [schemas-ballot_approved](#schemas-ballot_approved)

- **ballot_comments**

	Type: [schemas-ballot_comments](#schemas-ballot_comments)
