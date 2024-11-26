const api_democracy_client = require('@aluminumoxide/direct-democracy-democracy-api-client')
const {
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_api,
	reset_test_data,
	integration_test_setup
} = require('@aluminumoxide/direct-democracy-lib-server').testing

// errors
const errors = api_democracy_client.errors

// unit tests
const democracy_list_unit = async(request, reply, db, log) => {
	return await require('../handlers/democracy/list')(request, reply, db, log)
}

const democracy_read_unit = async(request, reply, db, log) => {
	return await require('../handlers/democracy/read')(request, reply, db, log)
}

const democracy_root_unit = async(request, reply, db, log) => {
	return await require('../handlers/democracy/root')(request, reply, db, log)
}

const democracy_population_unit = async(request, reply, db, log) => {
	return await require('../handlers/democracy/population')(request, reply, db, log)
}

const democracy_apply_unit = async(request, reply, db, log) => {
	return await require('../handlers/democracy/apply')(request, reply, db, log)
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

const democracy_population_integration = async () => {
	return await api_democracy_client.democracy_population_update({})
}

const democracy_apply_integration = async () => {
	return await api_democracy_client.democracy_apply({})
}

module.exports = {
	errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_api,
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
	democracy_apply_integration
}
