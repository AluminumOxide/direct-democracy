const sinon = require('sinon')
const { test_config } = require('@AluminumOxide/direct-democracy-lib-server')
const api_membership_client = require('@AluminumOxide/direct-democracy-membership-api-client')

// errors
const errors = api_membership_client.errors

// unit tests
const get_dummy_reply = function() {
	return {
		code: jest.fn().mockReturnThis(),
		send: jest.fn()
	}
}

const get_dummy_log = function() {
	return {
		warn: jest.fn(),
		info: jest.fn(),
		error: jest.fn()
	}
}

const get_dummy_db = function(mocks) {

	let mock_db_fxns = {}
	mock_db_fxns.select = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.from = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.where = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.whereNull = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.insert = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.update = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.del = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.as = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.sum = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.count = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.orderBy = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.groupBy = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.returning = sinon.stub().returns(mock_db_fxns)

	let mock_db = sinon.fake(() => mock_db_fxns)
	mock_db.raw = sinon.stub().returns(mock_db_fxns)
	mock_db.select = sinon.stub().returns(mock_db_fxns)
	mock_db.pageQuery = sinon.stub().returns(mock_db_fxns)

	mocks.forEach(({last_fxn, last_args, last_val, throws_error, call_no}) => {
		if(!!last_fxn) {
			let mock = mock_db_fxns[last_fxn]
			if(last_fxn === 'pageQuery') {
				mock = mock_db.pageQuery
			}
			if(!!last_args) {
				mock = mock.withArgs(...last_args)
			}
			if(!!throws_error) {
				if(!!call_no) {
					mock.onCall(call_no-1).throws(throws_error)
				} else {
					mock.throws(throws_error)
				}
			} else {
				if(!!call_no) {
					mock.onCall(call_no-1).returns(last_val)
				} else {
					mock.returns(last_val)
				}
			}
		}
	})

	return mock_db
}

const get_dummy_api = function(lib, mocks) {
	const api_client = require('@AluminumOxide/direct-democracy-'+lib+'-api-client')
	mocks.forEach(({fxn, val, err}) => {
		if(!!err) {
			api_client[fxn] = jest.fn().mockRejectedValue(val)
		} else {
			api_client[fxn] = jest.fn().mockResolvedValue(val)
		}
	})
	return api_client
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

const membership_population_unit = async(request, reply, db, log) => {
	return await require('../handlers/membership/population')(request, reply, db, log)
}


// integration tests

const reset_test_data = function () {
 	test_config()
	return require('./.testdata.json')
}

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

const membership_population_integration = async() => {
	return await api_membership_client.membership_population({})
}

module.exports = {
	errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_api,
	reset_test_data,
	membership_list_unit,
	membership_list_integration,
	membership_create_unit,
	membership_create_integration,
	membership_read_unit,
	membership_read_integration,
	membership_delete_unit,
	membership_delete_integration,
	membership_population_unit,
	membership_population_integration
}
