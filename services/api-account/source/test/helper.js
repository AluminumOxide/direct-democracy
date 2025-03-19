const sinon = require('sinon')
const api_account_client = require('@aluminumoxide/direct-democracy-account-api-client')
const { token_random } = require('@aluminumoxide/direct-democracy-lib-auth')
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
const errors = { ...api_account_client.errors }

// unit tests
const fill_bucket_unit = async(request, reply, db, log) => {
	return await require('../handlers/bucket/fill')(request, reply, db, log)
}

const sign_up_init_unit = async(request, reply, db, log) => {
	return await require('../handlers/signup/init')(request, reply, db, log)
}

const sign_up_verify_unit = async(request, reply, db, log) => {
	return await require('../handlers/signup/verify')(request, reply, db, log)
}

const sign_in_init_unit = async(request, reply, db, log) => {
	return await require('../handlers/signin/init')(request, reply, db, log)
}

const sign_in_verify_unit = async(request, reply, db, log) => {
	return await require('../handlers/signin/verify')(request, reply, db, log)
}

// helpers

const get_random_token = () => {
	return token_random()
}

module.exports = {
	sinon,
	errors,
	get_uuid,
	get_first_uuid,
	get_timestamp,
	get_first_timestamp,
	get_random_token,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_api,
	get_dummy_lib,
	reset_test_data,
	integration_test_setup,
	integration_test_query,
	fill_bucket_unit,
	sign_up_init_unit,
	sign_up_verify_unit,
	sign_in_init_unit,
	sign_in_verify_unit,
}
