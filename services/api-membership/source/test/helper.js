const api_membership_client = require('@aluminumoxide/direct-democracy-membership-api-client')
const { 
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_api,
	integration_test_setup
} = require('@aluminumoxide/direct-democracy-lib-server').testing

// errors
const errors = api_membership_client.errors

// unit tests
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

const membership_verify_unit = async(request, reply, db, log) => {
	return await require('../handlers/membership/verify')(request, reply, db, log)
}

const membership_unverify_unit = async(request, reply, db, log) => {
	return await require('../handlers/membership/unverify')(request, reply, db, log)
}

const membership_population_unit = async(request, reply, db, log) => {
	return await require('../handlers/membership/population')(request, reply, db, log)
}


// integration tests
const membership_list_integration = async(args) => {
	return await api_membership_client.membership_list(args)
}

const membership_create_integration = async (dem_id, pro_id) => {
	return await api_membership_client.membership_create({
		democracy_id: dem_id,
		profile_id: pro_id
	})
}

const membership_read_integration = async(membership_id) => {
	return await api_membership_client.membership_read({ membership_id })
}

const membership_delete_integration = async(membership_id, profile_id) => {
	return await api_membership_client.membership_delete({
		membership_id,
		profile_id
	})
}

const membership_verify_integration = async(membership_id) => {
	return await api_membership_client.membership_verify({ membership_id })
}

const membership_unverify_integration = async(membership_id) => {
	return await api_membership_client.membership_unverify({ membership_id })
}

const membership_population_integration = async() => {
	return await api_membership_client.membership_population({})
}

module.exports = {
	errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_api,
	integration_test_setup,
	membership_list_unit,
	membership_list_integration,
	membership_create_unit,
	membership_create_integration,
	membership_read_unit,
	membership_read_integration,
	membership_delete_unit,
	membership_delete_integration,
	membership_population_unit,
	membership_population_integration,
	membership_verify_unit,
	membership_verify_integration,
	membership_unverify_unit,
	membership_unverify_integration
}
