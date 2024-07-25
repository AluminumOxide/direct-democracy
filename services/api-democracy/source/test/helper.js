const sinon = require('sinon')
const { test_config } = require('@AluminumOxide/direct-democracy-lib-server')
const api_democracy_client = require('@AluminumOxide/direct-democracy-democracy-api-client')

// errors
const errors = api_democracy_client.errors

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
	Object.keys(api_client).forEach(key => {
		if(['schema','errors','ajv','env','url'].indexOf(key) === -1) {
			api_client[key] = sinon.stub()
		}
	})
	mocks.forEach(({fxn, val, err, call}) => {
		let mock = api_client[fxn]
		if(!!err) {
			if(!!call) {
				mock.onCall(call-1).throws(val)
			} else {
				mock.throws(val)
			}
		} else {
			if(!!call) {
				mock.onCall(call-1).returns(val)
			} else {
				mock.returns(val)
			}
		}
	})
	return api_client
}

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

const reset_test_data = function () {
 	test_config()
	return require('./.testdata.json')
}

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
