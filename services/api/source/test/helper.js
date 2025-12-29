const sinon = require('sinon')
const api_external_client = require('@aluminumoxide/direct-democracy-external-api-client')
const {
	get_uuid,
	get_first_uuid,
	get_timestamp,
	get_first_timestamp,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_lib,
	reset_test_data,
	integration_test_setup,
	integration_test_jwt,
	integration_test_query
} = require('@aluminumoxide/direct-democracy-lib-server').testing

// errors
const errors = api_external_client.errors

// unit tests
const democracy_list_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/democracy/list')(request, reply, db, log, lib)
}

const democracy_read_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/democracy/read')(request, reply, db, log, lib)
}

const membership_list_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/membership/list')(request, reply, db, log, lib)
}

const membership_create_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/membership/create')(request, reply, db, log, lib)
}

const membership_read_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/membership/read')(request, reply, db, log, lib)
}

const membership_delete_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/membership/delete')(request, reply, db, log, lib)
}

const proposal_my_list_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/proposal/my_list')(request, reply, db, log, lib)
}

const proposal_list_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/proposal/list')(request, reply, db, log, lib)
}

const proposal_create_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/proposal/create')(request, reply, db, log, lib)
}

const proposal_my_read_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/proposal/my_read')(request, reply, db, log, lib)
}

const proposal_read_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/proposal/read')(request, reply, db, log, lib)
}

const proposal_delete_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/proposal/delete')(request, reply, db, log, lib)
}

const ballot_my_list_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/ballot/my_list')(request, reply, db, log, lib)
}

const ballot_create_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/ballot/create')(request, reply, db, log, lib)
}

const ballot_my_read_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/ballot/my_read')(request, reply, db, log, lib)
}

const ballot_update_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/ballot/update')(request, reply, db, log, lib)
}

const ballot_delete_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/ballot/delete')(request, reply, db, log, lib)
}

// integration tests
const democracy_list_integration = async() => {
	return await api_external_client.democracy_list({})
}

const democracy_read_integration = async(democracy_id) => {
	return await api_external_client.democracy_read({ democracy_id })
}

const membership_list_integration = async(profile_id, auth_token, auth_expiry) => {
	return await api_external_client.membership_list({jwt: await integration_test_jwt({ profile_id, auth_token, auth_expiry }, 'profile')})
}

const membership_create_integration = async(democracy_id, profile_id, auth_token, auth_expiry) => {
	return await api_external_client.membership_create({ democracy_id, profile_id, jwt: await integration_test_jwt({ profile_id, auth_token, auth_expiry }, 'profile')})
}

const membership_read_integration = async(membership_id, profile_id, auth_token, auth_expiry) => {
	return await api_external_client.membership_read({ membership_id, jwt: await integration_test_jwt({ profile_id, auth_token, auth_expiry }, 'profile')})
}

const membership_delete_integration = async(membership_id, profile_id, auth_token, auth_expiry) => {
	return await api_external_client.membership_delete({ membership_id, jwt: await integration_test_jwt({ profile_id, auth_token, auth_expiry }, 'profile')})
}

const proposal_my_list_integration = async(args) => {
	let { profile_id, auth_token, auth_expiry, ...prop } = args
	prop.jwt = await integration_test_jwt({ profile_id, auth_token, auth_expiry }, 'profile')
	return await api_external_client.proposal_my_list(prop)
}

const proposal_list_integration = async() => {
	return await api_external_client.proposal_list({ })
}

const proposal_create_integration = async(args) => {
	let { profile_id, auth_token, auth_expiry, ...prop } = args
	prop.jwt = await integration_test_jwt({ profile_id, auth_token, auth_expiry }, 'profile')
	return await api_external_client.proposal_create(prop)
}

const proposal_my_read_integration = async(proposal_id, profile_id, auth_token, auth_expiry) => {
	return await api_external_client.proposal_my_read({ proposal_id, jwt: await integration_test_jwt({ profile_id, auth_token, auth_expiry }, 'profile') })
}

const proposal_read_integration = async(proposal_id) => {
	return await api_external_client.proposal_read({ proposal_id })
}

const proposal_delete_integration = async(proposal_id, profile_id, auth_token, auth_expiry) => {
	return await api_external_client.proposal_delete({ proposal_id, jwt: await integration_test_jwt({ profile_id, auth_token, auth_expiry }, 'profile') })
}

const ballot_my_list_integration = async(profile_id, auth_token, auth_expiry) => {
	return await api_external_client.ballot_my_list({ jwt: await integration_test_jwt({ profile_id, auth_token, auth_expiry }, 'profile') })
}

const ballot_create_integration = async({ proposal_id, ballot_approved, ballot_comments, profile_id, auth_token, auth_expiry }) => {
	return await api_external_client.ballot_create({ proposal_id, ballot_approved, ballot_comments, jwt: await integration_test_jwt({ profile_id, auth_token, auth_expiry }, 'profile') })
}

const ballot_my_read_integration = async(proposal_id, profile_id, auth_token, auth_expiry) => {
	return await api_external_client.ballot_my_read({ proposal_id, jwt: await integration_test_jwt({profile_id, auth_token, auth_expiry}, 'profile')})
}

const ballot_update_integration = async(proposal_id, ballot_approved, ballot_comments, profile_id, auth_token, auth_expiry) => {
	return await api_external_client.ballot_update({ proposal_id, ballot_approved, ballot_comments, jwt: await integration_test_jwt({profile_id, auth_token, auth_expiry}, 'profile')})
}

const ballot_delete_integration = async(proposal_id, profile_id, auth_token, auth_expiry) => {
	return await api_external_client.ballot_delete({ proposal_id, jwt: await integration_test_jwt({profile_id, auth_token, auth_expiry}, 'profile')})
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
	get_dummy_lib,
	integration_test_setup,
	integration_test_query,
	democracy_list_unit,
	democracy_read_unit,
	membership_list_unit,
	membership_create_unit,
	membership_read_unit,
	membership_delete_unit,
	proposal_my_list_unit,
	proposal_list_unit,
	proposal_create_unit,
	proposal_my_read_unit,
	proposal_read_unit,
	proposal_delete_unit,
	ballot_my_list_unit,
	ballot_create_unit,
	ballot_my_read_unit,
	ballot_update_unit,
	ballot_delete_unit,
	democracy_list_integration,
	democracy_read_integration,
	membership_list_integration,
	membership_create_integration,
	membership_read_integration,
	membership_delete_integration,
	proposal_my_list_integration,
	proposal_list_integration,
	proposal_create_integration,
	proposal_my_read_integration,
	proposal_read_integration,
	proposal_delete_integration,
	ballot_my_list_integration,
	ballot_create_integration,
	ballot_my_read_integration,
	ballot_update_integration,
	ballot_delete_integration
}
