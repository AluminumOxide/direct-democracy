const sinon = require('sinon')
const uuid = require('uuid')

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
	const api_client = require('@aluminumoxide/direct-democracy-'+lib+'-api-client')
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

const integration_test_setup = function() {
	let pg
	const knex = require("knex")
	beforeEach(done => {
		try {
			pg = knex({
				client: 'pg',
				connection:  process.env.TEST_CONNECTION_STRING
			})
			pg.raw('call reset_test_data();').then(() => done())
		} catch (err) {
			console.error(err)
			done(err)
		}
	})
	afterEach(done => {
		pg.destroy().then(() => done())
	})
	return require('../../../test/.testdata.json')
}

// utils
const get_uuid = function() {
	return uuid.v4()
}

const get_first_uuid = function() {
	return '00000000-0000-0000-0000-000000000000'
}

const get_timestamp = function() {
	return new Date().toJSON()
}

const get_first_timestamp = function() {
	return '1970-01-01T00:00:00.000Z'
}

module.exports = { get_uuid, get_first_uuid, get_timestamp, get_first_timestamp, get_dummy_reply, get_dummy_log, get_dummy_api, get_dummy_db, integration_test_setup }
