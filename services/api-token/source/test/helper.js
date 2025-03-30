const sinon = require('sinon')
const api_token_client = require('@aluminumoxide/direct-democracy-token-api-client')
const {
	get_uuid,
	get_first_uuid,
	get_timestamp,
	get_first_timestamp,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_api,
	get_dummy_lib,
	reset_test_data,
	integration_test_setup,
	integration_test_query
} = require('@aluminumoxide/direct-democracy-lib-server').testing

// errors
const errors = { ...api_token_client.errors }

// unit tests
const fill_buckets_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/bucket/fill')(request, reply, db, log, lib)
}

const step_one_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/step/one')(request, reply, db, log, lib)
}

const step_two_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/step/two')(request, reply, db, log, lib)
}

const step_three_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/step/three')(request, reply, db, log, lib)
}

// integration tests
const step_one_integration = async(pke_key) => {
	return await api_token_client.step_one({ pke_key })
}

const step_two_integration = async(pke_key, pake_key, encrypted_id) => {
	return await api_token_client.step_two({ pke_key, pake_key, encrypted_id })
}

const step_three_integration = async(pake_key, pake_proof) => {
	return await api_token_client.step_three({ pake_key, pake_proof })
}

const fill_buckets_integration = async(bucket_size) => {
	return await api_token_client.fill_buckets({ bucket_size })
}

const clean_token_integration = async (token) => {
	return await api_token_client.clean_token(token)
}

module.exports = {
	sinon,
	errors,
	get_uuid,
	get_first_uuid,
	get_timestamp,
	get_first_timestamp,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_api,
	get_dummy_lib,
	reset_test_data,
	integration_test_setup,
	integration_test_query,
	fill_buckets_unit,
	fill_buckets_integration,
	clean_token_integration,
	step_one_unit,
	step_one_integration,
	step_two_unit,
	step_two_integration,
	step_three_unit,
	step_three_integration,
}
