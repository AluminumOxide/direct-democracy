const sinon = require('sinon')
const api_democracy_client = require('@aluminumoxide/direct-democracy-democracy-api-client')
const api_membership_client = require('@aluminumoxide/direct-democracy-membership-api-client')
const api_proposal_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
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
	integration_test_setup
} = require('@aluminumoxide/direct-democracy-lib-server').testing

// errors
const errors = { ...api_democracy_client.errors, ...api_membership_client.errors, ...api_proposal_client.errors }

// unit tests
const democracy_list_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/democracy/list')(request, reply, db, log, lib)
}

const democracy_read_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/democracy/read')(request, reply, db, log, lib)
}

const democracy_root_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/democracy/root')(request, reply, db, log, lib)
}

const democracy_population_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/democracy/population')(request, reply, db, log, lib)
}

const democracy_apply_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/democracy/apply')(request, reply, db, log, lib)
}

// integration tests
const democracy_list_integration = async(args) => {
	return await api_democracy_client.democracy_list(args)
}

const democracy_read_integration = async (id) => {
	return await api_democracy_client.democracy_read({ democracy_id: id })
}

const democracy_root_integration = async () => {
	return await api_democracy_client.democracy_root({})
}

const democracy_population_integration = async (time_start, time_end) => {
	return await api_democracy_client.democracy_population_update({ time_start, time_end })
}

const democracy_apply_integration = async (proposal_id) => {
	return await api_democracy_client.apply_proposal({ proposal_id })
}

const membership_create_integration = async(democracy_id, profile_id) => {
	return await api_membership_client.membership_create({ democracy_id, profile_id })
}

const proposal_read_integration = async (proposal_id) => {
	return await api_proposal_client.proposal_read({ proposal_id })
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
	reset_test_data,
	integration_test_setup,
	democracy_list_unit,
	democracy_list_integration,
	democracy_read_unit,
	democracy_read_integration,
	democracy_root_unit,
	democracy_root_integration,
	democracy_population_unit,
	democracy_population_integration,
	democracy_apply_unit,
	democracy_apply_integration,
	membership_create_integration,
	proposal_read_integration
}
