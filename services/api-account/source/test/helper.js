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
const fill_bucket_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/bucket/fill')(request, reply, db, log, lib)
}

const sign_up_init_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/signup/init')(request, reply, db, log, lib)
}

const sign_up_verify_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/signup/verify')(request, reply, db, log, lib)
}

const sign_in_init_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/signin/init')(request, reply, db, log, lib)
}

const sign_in_verify_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/signin/verify')(request, reply, db, log, lib)
}

// integration tests
const fill_bucket_integration = async(bucket, tokens) => {
	return await api_account_client.fill_bucket({ bucket, tokens})
}

const sign_up_init_integration = async(email, zkpp, salt, encrypted_question) => {
	return await api_account_client.sign_up_init({ email, zkpp, salt, encrypted_question })
}

const sign_up_verify_integration = async(email_token, account_token, encrypted_profile) => {
	return await api_account_client.sign_up_verify({ email_token, account_token, encrypted_profile })
}

const sign_in_init_integration = async(email, key) => {
	return await api_account_client.sign_in_init({ email, key })
}

const sign_in_verify_integration = async(email, key) => {
	return await api_account_client.sign_in_verify({ email, key })
}

const client_sign_up_one_integration = async(email, password, question) => {
	return await api_account_client.client_sign_up_one({ email, password, question })
}

const client_sign_up_two_integration = async(answer, salt, profile_id, email_token, account_token) => {
	return await api_account_client.client_sign_up_two({ answer, salt, profile_id, email_token, account_token })
}

const client_sign_in_one_integration = async(email, password) => {
	return await api_account_client.client_sign_in_one({ email, password })
}

const client_sign_in_two_integration = async(answer, salt, encrypted_profile) => {
	return await api_account_client.client_sign_in_two({ answer, salt, encrypted_profile })
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
	fill_bucket_integration,
	sign_up_init_integration,
	sign_up_verify_integration,
	sign_in_init_integration,
	sign_in_verify_integration,
	client_sign_up_one_integration,
	client_sign_up_two_integration,
	client_sign_in_one_integration,
	client_sign_in_two_integration,
}
