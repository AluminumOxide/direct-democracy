const sinon = require('sinon')
const api_profile_client = require('@aluminumoxide/direct-democracy-profile-api-client')
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
	integration_test_query,
	integration_test_jwt
} = require('@aluminumoxide/direct-democracy-lib-server').testing

// errors
const errors = { ...api_profile_client.errors }

// unit tests
const fill_bucket_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/bucket/fill')(request, reply, db, log, lib)
}

const sign_up_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/signup/signup')(request, reply, db, log, lib)
}

const sign_in_init_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/signin/init')(request, reply, db, log, lib)
}

const sign_in_finish_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/signin/finish')(request, reply, db, log, lib)
}

const sign_in_verify_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/signin/verify')(request, reply, db, log, lib)
}

const sign_out_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/signout/signout')(request, reply, db, log, lib)
}


// integration tests
const fill_bucket_integration = async(bucket, tokens) => {
	return await api_profile_client.fill_bucket({ bucket, tokens })
}

const sign_up_integration = async(profile_id, zkpp, salt, profile_token) => {
	return await api_profile_client.sign_up({ profile_id, zkpp, salt, profile_token })
}

const sign_in_init_integration = async(profile_id, key) => {
	return await api_profile_client.sign_in_init({ profile_id, key })
}

const sign_in_finish_integration = async(profile_id, key) => {
	return await api_profile_client.sign_in_finish({ profile_id, key })
}

const sign_in_verify_integration = async(profile_id, auth_token, auth_expiry) => {
	return await api_profile_client.sign_in_verify({ jwt: await integration_test_jwt({ profile_id, auth_token, auth_expiry })})
}

const sign_out_integration = async(profile_id, auth_token, auth_expiry) => {
	return await api_profile_client.sign_out({ jwt: await integration_test_jwt({ profile_id, auth_token, auth_expiry })})
}


/* helpers */

const get_random_token = () => {
	return token_random()
}

module.exports = {
	sinon,
	errors,
	get_uuid,
	get_first_uuid,
	get_random_token,
	get_timestamp,
	get_first_timestamp,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_api,
	get_dummy_lib,
	reset_test_data,
	integration_test_jwt,
	integration_test_setup,
	integration_test_query,
	fill_bucket_unit,
	sign_out_unit,
	sign_up_unit,
	sign_in_init_unit,
	sign_in_finish_unit,
	sign_in_verify_unit,
	fill_bucket_integration,
	sign_out_integration,
	sign_up_integration,
	sign_in_init_integration,
	sign_in_finish_integration,
	sign_in_verify_integration
}
