# API Documentation

## Routes
### GET /v1/jwt/verify

*Verify JWT issued by this service*

**Responses**

- [200]
Type: object

- [401](#responses-401)
- [500](#responses-500)

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

### POST /v1/democracy/:democracy_id/membership

*Create a membership*

**Params**

- [democracy_id](#params-democracy_id)

**Bodies**

 - [bodies-membership_create](#bodies-membership_create)

**Responses**

- [200](#responses-membership_read)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### POST /v1/democracy/:democracy_id/proposal

*Create a proposal*

**Params**

- [democracy_id](#params-democracy_id)

**Bodies**

Type: object

Required:

- proposal_name
- proposal_description
- proposal_target
- proposal_changes

Properties:

- **proposal_name**

	 - [schemas-proposal_name](#schemas-proposal_name)

- **proposal_description**

	 - [schemas-proposal_description](#schemas-proposal_description)

- **proposal_target**

	 - [schemas-proposal_target](#schemas-proposal_target)

- **proposal_changes**

	 - [schemas-proposal_changes](#schemas-proposal_changes)


**Responses**
undefined

### GET /v1/proposal

*List proposals*

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

	 - [queries-proposal_sort](#queries-proposal_sort)

- **filter**

	 - [queries-proposal_filter](#queries-proposal_filter)


**Responses**
undefined

### GET /v1/proposal/:proposal_id

*Read a proposal*

**Params**

- [proposal_id](#params-proposal_id)

**Responses**
undefined

### GET /v1/my/proposal

*List proposals*

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

	 - [queries-proposal_sort](#queries-proposal_sort)

- **filter**

	 - [queries-proposal_filter](#queries-proposal_filter)


**Responses**
undefined

### GET /v1/my/proposal/:proposal_id

*Read a proposal*

**Params**

- [proposal_id](#params-proposal_id)

**Responses**
undefined

### DELETE /v1/my/proposal/:proposal_id

*Delete a proposal*

**Params**

- [proposal_id](#params-proposal_id)

**Responses**
undefined

### POST /v1/my/proposal/:proposal_id

*Cast my ballot*

**Params**

- [proposal_id](#params-proposal_id)

**Bodies**

 - [bodies-ballot_create](#bodies-ballot_create)

**Responses**
undefined

### GET /v1/my/ballot

*List my ballots*

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

	 - [queries-ballot_sort](#queries-ballot_sort)

- **filter**

	 - [queries-ballot_filter](#queries-ballot_filter)


**Responses**
undefined

### GET /v1/my/ballot/:proposal_id

*Get my ballot*

**Params**

- [proposal_id](#params-proposal_id)

**Responses**
undefined

### PATCH /v1/my/ballot/:proposal_id

*Edit my ballot*

**Params**

- [proposal_id](#params-proposal_id)

**Bodies**

 - [bodies-ballot_update](#bodies-ballot_update)

**Responses**
undefined

### DELETE /v1/my/ballot/:proposal_id

*Delete my ballot*

**Params**

- [proposal_id](#params-proposal_id)

**Responses**
undefined

### GET /v1/my/membership

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

### GET /v1/my/membership/:membership_id

*Get a membership*

**Params**

- [membership_id](#params-membership_id)

**Responses**

- [200](#responses-membership_read)
- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)

### DELETE /v1/my/membership/:membership_id

*Delete a membership*

**Params**

- [membership_id](#params-membership_id)

**Responses**

- [204]

*successfully deleted*


- [400](#responses-400)
- [401](#responses-401)
- [500](#responses-500)


## Headers

#### headers-jwt

Type: string
## Params

#### params-proposal_id

Type: [schemas-proposal_id](#schemas-proposal_id)
#### params-ballot_id

Type: [schemas-ballot_id](#schemas-ballot_id)
#### params-membership_id

Type: [schemas-membership_id](#schemas-membership_id)
#### params-democracy_id

Type: [schemas-democracy_id](#schemas-democracy_id)
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
- proposal_description
- democracy_id
- proposal_target
- proposal_votable
- proposal_passed
- date_created
- date_updated
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


		One Of:

		- Type: [schemas-democracy_id](#schemas-democracy_id)

		- Type: array

			Items:

			- Type: [schemas-democracy_id](#schemas-democracy_id)



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
		- !=

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
		- !=

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


- **proposal_changes**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: string


#### queries-ballot_sort

Type: string

Enum:

- date_created
- date_updated
#### queries-ballot_filter

Type: object

Properties:

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

		Type: [schemas-op](#schemas-op)

	- **val**

		Type: array

		Items:

		- Type: [schemas-democracy_id](#schemas-democracy_id)



- **democracy_name**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op-search](#schemas-op-search)

	- **val**

		Type: [schemas-democracy_name](#schemas-democracy_name)


- **democracy_description**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op-search](#schemas-op-search)

	- **val**

		Type: [schemas-democracy_description](#schemas-democracy_description)


- **democracy_population_verified**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op-number](#schemas-op-number)

	- **val**

		Type: [schemas-democracy_population](#schemas-democracy_population)


- **democracy_population_unverified**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op-number](#schemas-op-number)

	- **val**

		Type: [schemas-democracy_population](#schemas-democracy_population)


- **date_created**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op-date](#schemas-op-date)

	- **val**

		Type: [schemas-date_created](#schemas-date_created)


- **date_updated**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op-date](#schemas-op-date)

	- **val**

		Type: [schemas-date_updated](#schemas-date_updated)


- **democracy_conduct**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op-search](#schemas-op-search)

	- **val**

		Type: string


- **democracy_content**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op-search](#schemas-op-search)

	- **val**

		Type: string


- **democracy_metas**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op-search](#schemas-op-search)

	- **val**

		Type: string


- **democracy_parent**

	Type: object

	Additional Properties: false

	Properties:

	- **op**

		Type: [schemas-op-uuid](#schemas-op-uuid)

	- **val**

		Type: [schemas-uuid](#schemas-uuid)


## Bodies

#### bodies-proposal_create

Type: [schemas-proposal_create](#schemas-proposal_create)
#### bodies-ballot_create

Type: [schemas-ballot_create](#schemas-ballot_create)
#### bodies-ballot_update

Type: [schemas-ballot_update](#schemas-ballot_update)
#### bodies-membership_create

Type: [schemas-membership_create](#schemas-membership_create)
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
#### responses-ballot_delete


*Successfully deleted a ballot*


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
#### responses-democracy_list


*Successfully return list of democracies*


Type: array

Items:

- Type: [schemas-democracy_list](#schemas-democracy_list)
#### responses-democracy_read


*Successfully fetched a democracy*


Type: [schemas-democracy_read](#schemas-democracy_read)
## Data

#### schemas-op

Type: string

Enum:

- ~
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
#### schemas-op-search

Type: string

Enum:

- ~
#### schemas-op-date

Type: string

Enum:

- =
- !=
- \>=
- \>
- <
- <=
#### schemas-op-number

Type: string

Enum:

- =
- !=
- \>=
- \>
- <
- <=
#### schemas-op-uuid

Type: string

Enum:

- =
- !=
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

- **date_created**

	Type: [schemas-date_created](#schemas-date_created)

- **date_updated**

	Type: [schemas-date_updated](#schemas-date_updated)

#### schemas-proposal_create


*Proposal - Create*


Type: object

Required:

- profile_id
- proposal_name
- proposal_description
- proposal_target
- proposal_changes

Properties:

- **profile_id**

	Type: [schemas-profile_id](#schemas-profile_id)

- **proposal_name**

	Type: [schemas-proposal_name](#schemas-proposal_name)

- **proposal_description**

	Type: [schemas-proposal_description](#schemas-proposal_description)

- **proposal_target**

	Type: [schemas-proposal_target](#schemas-proposal_target)

- **proposal_changes**

	Type: [schemas-proposal_changes](#schemas-proposal_changes)

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

- ballot_approved

Additional Properties: false

Properties:

- **ballot_approved**

	Type: [schemas-ballot_approved](#schemas-ballot_approved)

- **ballot_comments**

	Type: [schemas-ballot_comments](#schemas-ballot_comments)

#### schemas-ballot_update


*Ballot - Update*


Type: object

Required:

- ballot_approved

Properties:

- **ballot_approved**

	Type: [schemas-ballot_approved](#schemas-ballot_approved)

- **ballot_comments**

	Type: [schemas-ballot_comments](#schemas-ballot_comments)

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

- profile_id

Properties:

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

- **proposal_lifetime_minimum**

	Type: integer

- **proposal_lifetime_maximum**

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

#### schemas-jwt


*jwt*


Type: string