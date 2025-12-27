const api_proposal_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
const {
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_lib,
	integration_test_setup
} = require('@aluminumoxide/direct-democracy-lib-server').testing

// errors
const errors = api_proposal_client.errors

// unit tests
const ballot_list_unit = async(request, reply, db, log, lib) => {
        return await require('../handlers/ballot/list')(request, reply, db, log, lib)
}

const ballot_read_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/ballot/read')(request, reply, db, log, lib)
}

const ballot_create_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/ballot/create')(request, reply, db, log, lib)
}

const ballot_update_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/ballot/update')(request, reply, db, log, lib)
}

const ballot_delete_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/ballot/delete')(request, reply, db, log, lib)
}

const ballot_verified_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/ballot/verified')(request, reply, db, log, lib)
}

const proposal_list_unit = async(request, reply, db, log, lib) => {
        return await require('../handlers/proposal/list')(request, reply, db, log, lib)
}

const proposal_read_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/proposal/read')(request, reply, db, log, lib)
}

const proposal_create_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/proposal/create')(request, reply, db, log, lib)
}

const proposal_close_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/proposal/close')(request, reply, db, log, lib)
}

const proposal_delete_unit = async(request, reply, db, log, lib) => {
	return await require('../handlers/proposal/delete')(request, reply, db, log, lib)
}

// integration tests
const ballot_list_integration = async(args) => {
        return await api_proposal_client.ballot_list(args)
}

const ballot_read_integration = async (proposal_id, membership_id) => {
	return await api_proposal_client.ballot_read({ proposal_id, membership_id })
}

const ballot_create_integration = async ({proposal_id, membership_id, ballot_approved, ballot_comments}) => {
       return await api_proposal_client.ballot_create({
       	proposal_id,
       	membership_id,
       	ballot_approved,
       	ballot_comments
       })
}

const ballot_update_integration = async ({ proposal_id, membership_id, ballot_approved, ballot_comments }) => {
	return await api_proposal_client.ballot_update({
		proposal_id,
		membership_id,
		ballot_approved,
		ballot_comments
	})
}

const ballot_delete_integration = async (proposal_id, membership_id) => {
	return await api_proposal_client.ballot_delete({ proposal_id, membership_id })
}

const ballot_verified_integration = async (time_start, time_end) => {
	return await api_proposal_client.ballot_verified({ time_start, time_end })
}

const proposal_list_integration = async(args) => {
        return await api_proposal_client.proposal_list(args)
}

const proposal_read_integration = async(proposal_id) => {
	return await api_proposal_client.proposal_read({ proposal_id })
}

const proposal_create_integration = async ({ democracy_id, membership_id, proposal_name, proposal_description, proposal_target, proposal_changes }) => {
	return await api_proposal_client.proposal_create({
		democracy_id,
		membership_id,
		proposal_name,
		proposal_description,
		proposal_target,
		proposal_changes
	})
}

const proposal_delete_integration = async(proposal_id) => {
        return await api_proposal_client.proposal_delete({ proposal_id })
}

const proposal_close_integration = async(proposal_id, passed) => {
	return await api_proposal_client.proposal_close({ proposal_id, passed })
}

module.exports = {
	errors,
	get_uuid,
	get_dummy_db,
	get_dummy_lib,
	get_dummy_log,
	get_dummy_reply,
	ballot_list_unit,
	ballot_read_unit,
	ballot_create_unit,
	ballot_update_unit,
	ballot_delete_unit,
	ballot_verified_unit,
	proposal_list_unit,
	proposal_read_unit,
	proposal_create_unit,
	proposal_delete_unit,
	proposal_close_unit,
	integration_test_setup,
	ballot_list_integration,
	ballot_read_integration,
	ballot_create_integration,
	ballot_update_integration,
	ballot_delete_integration,
	ballot_verified_integration,
	proposal_list_integration,
	proposal_read_integration,
	proposal_create_integration,
	proposal_delete_integration,
	proposal_close_integration
}

