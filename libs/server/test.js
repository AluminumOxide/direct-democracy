const sinon = require('sinon')
const auth = require('@aluminumoxide/direct-democracy-lib-auth')

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

	// mock knex functions
	let mock_db = {}
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
	mock_db_fxns.limit = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.orderBy = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.orderByRaw = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.groupBy = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.returning = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.raw = sinon.stub().returns(mock_db_fxns)
	mock_db_fxns.fromRaw = sinon.stub().returns(mock_db_fxns)
  	mock_db = sinon.fake(() => mock_db_fxns)
	mock_db.raw = sinon.stub().returns(mock_db_fxns)
	mock_db.fromRaw = sinon.stub().returns(mock_db_fxns)
	mock_db.select = sinon.stub().returns(mock_db_fxns)
	mock_db.insert = sinon.stub().returns(mock_db_fxns)
	mock_db.pageQuery = sinon.stub().returns(mock_db_fxns)

	// add provided mocks
	mocks.forEach(({fxn, args, val, err, call}) => {
		if(!!fxn) {
			let mock = mock_db_fxns[fxn]
			if(fxn === 'pageQuery') {
				mock = mock_db.pageQuery
			}
			if(!!args) {
				mock = mock.withArgs(...args)
			}
			if(!!err) {
				if(!!call) {
					mock.onCall(call-1).throws(new Error(val))
				} else {
					mock.throws(new Error(val))
				}
			} else {
				if(!!call) {
					mock.onCall(call-1).returns(val)
				} else {
					mock.returns(val)
				}
			}
		}
	})
	return mock_db
}

const get_dummy_lib = function(mocks, errors) {
	let libs = {}
	mocks.forEach(({lib, fxn, val, err, call}) => {
		if(Object.keys(libs).indexOf(lib) < 0) {
			libs[lib] = {errors}
		}
		if(Object.keys(libs[lib]).indexOf(fxn) < 0) {
			libs[lib][fxn] = sinon.stub()
		}
		if(!!err) {
			if(!!call) {
				libs[lib][fxn].onCall(call-1).throws(new Error(val))
			} else {
				libs[lib][fxn].throws(new Error(val))
			}
		} else {
			if(!!call) {
				libs[lib][fxn].onCall(call-1).returns(val)
			} else {
				libs[lib][fxn].returns(val)
			}
		}
	})
	return libs
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

const integration_test_query = async function(srv, sql) {
	let pg
	const knex = require("knex")
	try {
		pg = knex({
			client: 'pg',
			connection: `postgres://${srv}:${srv}@0.0.0.0:5432/${srv}`
		})
		return await pg.raw(sql)
	} catch (err) {
		console.error(err)
	}
}

const integration_test_jwt = async function(data, service) {
	let keys
	if(!!service) {
		keys = await auth.jwt_read_keys(`./certs/api-${service}.jwt.public.der`,`./certs/api-${service}.jwt.private.der`) 
	} else {
		keys = await auth.jwt_read_keys(`./certs/jwt.public.der`,`./certs/jwt.private.der`)
	}
	return await auth.jwt_sign(keys.private, data)
}

// utils
const get_uuid = function() {
	return auth.uuid_random()
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

module.exports = { get_uuid, get_first_uuid, get_timestamp, get_first_timestamp, get_dummy_reply, get_dummy_log, get_dummy_lib, get_dummy_db, integration_test_setup, integration_test_query, integration_test_jwt, sinon }
