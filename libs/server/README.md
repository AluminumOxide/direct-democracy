# Server Library

## Overview
Basic Fastify server with:

- Routes and schemas defined by spec.json
- Postgres querying with Knex.js
- Automated README
- Autorun tests with Jest

## Usage

### Documentation
Documentation is automatically written to `./README.md`, using the definition provided in `spec.json`.

### Tests
Tests are automatically run when a code file is saved. Test results can be viewed by tailing the service docker logs.

### Set Up

#### index.js
```
const { start } = require('@aluminumoxide/direct-democracy-lib-server')
                       
start({
	version: 'v1',
	spec: require('./spec.json'),
	handlers: require('./handlers/'),
	env: process.env.ENV,
	address: ...,
	port: ...,
	db_user: ...,
	db_password: ...,
	db_name: ...,
	db_port: ...,
	db_address: ...
})
```

#### Handler Example
```
const { your_error, your_warning } = require('../../errors.json')

const your_handler = async function(request, reply, db, log) {
	const { your_query_var, your_param_var, your_body_var } = request

	try {
		const rows = await db.knex_function(...)

		if(!rows || rows.length < 1) {
			log.warn(...)
			return reply.code(400).send(new Error(your_warning))
		}

		log.info(...)
		return reply.code(200).send(rows)

	} catch (e) {
		log.error(...)
		return reply.code(500).send(new Error(your_error))
	}
}

module.exports = your_handler
```

#### spec.json
```
{  
	"servers": {	
		"local": "...",
		"dev": "..."	
	},
	"schemas": {
		"your_schema": {
			"$id": "schemas-your_schema",
			"type": "json-schema definition...",
			...
		},
		...
	},
	"params": {
		"your_param": {
			"$id": "params-your_param",
			"$ref": "schemas-your_schema"
		},
		...
	},
	"queries": {
		"your_query": {
			"$id": "queries-your_query",
			"$ref": "schemas-..."
		},
		...
	},
	"bodies": {
		"your_body": {
			"$id": "bodies-your_body",
			"$ref": "schemas-..."
		}
	},
	"responses": {
		"200": {
			"$id": "responses-200",
			"description": "Success"
		},
		...
	},
	"routes": {
		"/your_route": {
			"GET": {
				"description": "...",
				"operationId": "your_route",
				"query": {
					"your_query": { "$ref": "queries-your_query"},
					...
				},
				"param": {
					"your_param": { "$ref": "params-your_param"},
					...
				},
				"body": {
					"$ref": "bodies-your_body"
				},
				"responses": {
					"200": {
						"$ref": "responses-200"
					},
					...
				}
			}
		},
		...
	}
}
```

#### errors.json
```
{
	"your_error": "Error description shown to users",
	...
}
```	



