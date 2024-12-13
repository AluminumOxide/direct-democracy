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
	get_dummy_api,
	reset_test_data,
	integration_test_setup
} = require('@aluminumoxide/direct-democracy-lib-server').testing

// errors
const errors = api_external_client.errors

// unit tests
const democracy_list_unit = async(request, reply, db, log) => {
	return await require('../handlers/democracy/list')(request, reply, db, log)
}

const democracy_read_unit = async(request, reply, db, log) => {
	return await require('../handlers/democracy/read')(request, reply, db, log)
}

const membership_list_unit = async(request, reply, db, log) => {
	return await require('../handlers/membership/list')(request, reply, db, log)
}

const membership_create_unit = async(request, reply, db, log) => {
	return await require('../handlers/membership/create')(request, reply, db, log)
}

const membership_read_unit = async(request, reply, db, log) => {
	return await require('../handlers/membership/read')(request, reply, db, log)
}

const membership_delete_unit = async(request, reply, db, log) => {
	return await require('../handlers/membership/delete')(request, reply, db, log)
}

const proposal_list_unit = async(request, reply, db, log) => {
	return await require('../handlers/proposal/list')(request, reply, db, log)
}

const proposal_list_public_unit = async(request, reply, db, log) => {
	return await require('../handlers/proposal/list_public')(request, reply, db, log)
}

const proposal_create_unit = async(request, reply, db, log) => {
	return await require('../handlers/proposal/create')(request, reply, db, log)
}

const proposal_read_unit = async(request, reply, db, log) => {
	return await require('../handlers/proposal/read')(request, reply, db, log)
}

const proposal_read_public_unit = async(request, reply, db, log) => {
	return await require('../handlers/proposal/read_public')(request, reply, db, log)
}

const proposal_delete_unit = async(request, reply, db, log) => {
	return await require('../handlers/proposal/delete')(request, reply, db, log)
}

const ballot_list_unit = async(request, reply, db, log) => {
	return await require('../handlers/ballot/list')(request, reply, db, log)
}

const ballot_list_public_unit = async(request, reply, db, log) => {
	return await require('../handlers/ballot/list_public')(request, reply, db, log)
}

const ballot_create_unit = async(request, reply, db, log) => {
	return await require('../handlers/ballot/create')(request, reply, db, log)
}

const ballot_read_unit = async(request, reply, db, log) => {
	return await require('../handlers/ballot/read')(request, reply, db, log)
}

const ballot_update_unit = async(request, reply, db, log) => {
	return await require('../handlers/ballot/update')(request, reply, db, log)
}

const ballot_delete_unit = async(request, reply, db, log) => {
	return await require('../handlers/ballot/delete')(request, reply, db, log)
}

// integration tests
const democracy_list_integration = async() => {
	return await api_external_client.democracy_list({})
}

const democracy_read_integration = async(democracy_id) => {
	return await api_external_client.democracy_read({ democracy_id })
}

const membership_list_integration = async(args) => {
	return await api_external_client.membership_list(args)
}

const membership_create_integration = async(democracy_id, profile_id) => {
	return await api_external_client.membership_create({ democracy_id, profile_id })
}

const membership_read_integration = async(membership_id, profile_id) => {
	return await api_external_client.membership_read({ membership_id, profile_id })
}

const membership_delete_integration = async(membership_id, profile_id) => {
	return await api_external_client.membership_delete({ membership_id, profile_id })
}

const proposal_list_integration = async() => {
	return await api_external_client.proposal_list()
}

const proposal_list_public_integration = async(democracy_id) => {
	return await api_external_client.proposal_list_public({ democracy_id })
}

const proposal_create_integration = async(args) => {
	return await api_external_client.proposal_create(args)
}

const proposal_read_integration = async(proposal_id, profile_id) => {
	return await api_external_client.proposal_read({ proposal_id, profile_id })
}

const proposal_read_public_integration = async(proposal_id, democracy_id) => {
	return await api_external_client.proposal_read_public({ proposal_id, democracy_id })
}

const proposal_delete_integration = async(proposal_id, profile_id) => {
	return await api_external_client.proposal_delete({ proposal_id, profile_id })
}

const ballot_list_integration = async(profile_id) => {
	return await api_external_client.ballot_list({ profile_id })
}

const ballot_list_public_integration = async(args) => {
	return await api_external_client.ballot_list_public(args)
}

const ballot_create_integration = async(args) => {
	return await api_external_client.ballot_create(args)
}

const ballot_read_integration = async(ballot_id, profile_id) => {
	return await api_external_client.ballot_read({ ballot_id, profile_id })
}

const ballot_update_integration = async(args) => {
	return await api_external_client.ballot_update(args)
}

const ballot_delete_integration = async(ballot_id, profile_id) => {
	return await api_external_client.ballot_delete({ ballot_id, profile_id })
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
	integration_test_setup,
	democracy_list_unit,
	democracy_read_unit,
	membership_list_unit,
	membership_create_unit,
	membership_read_unit,
	membership_delete_unit,
	proposal_list_unit,
	proposal_list_public_unit,
	proposal_create_unit,
	proposal_read_unit,
	proposal_read_public_unit,
	proposal_delete_unit,
	ballot_list_unit,
	ballot_list_public_unit,
	ballot_create_unit,
	ballot_read_unit,
	ballot_update_unit,
	ballot_delete_unit,
	democracy_list_integration,
	democracy_read_integration,
	membership_list_integration,
	membership_create_integration,
	membership_read_integration,
	membership_delete_integration,
	proposal_list_integration,
	proposal_list_public_integration,
	proposal_create_integration,
	proposal_read_integration,
	proposal_read_public_integration,
	proposal_delete_integration,
	ballot_list_integration,
	ballot_list_public_integration,
	ballot_create_integration,
	ballot_read_integration,
	ballot_update_integration,
	ballot_delete_integration
}
