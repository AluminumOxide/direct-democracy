const sinon = require('sinon')
const { test_config } = require('@AluminumOxide/direct-democracy-lib-server')
const api_proposal_client = require('@AluminumOxide/direct-democracy-proposal-api-client')

// errors
const errors = api_proposal_client.errors

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

const ballot_read_unit = async(request, reply, db, log) => {
	return await require('../handlers/ballot/read')(request, reply, db, log)
}

const ballot_create_unit = async(request, reply, db, log) => {
	return await require('../handlers/ballot/create')(request, reply, db, log)
}

const ballot_update_unit = async(request, reply, db, log) => {
	return await require('../handlers/ballot/update')(request, reply, db, log)
}

const ballot_delete_unit = async(request, reply, db, log) => {
	return await require('../handlers/ballot/delete')(request, reply, db, log)
}

const proposal_read_unit = async(request, reply, db, log) => {
	return await require('../handlers/proposal/read')(request, reply, db, log)
}

const proposal_create_unit = async(request, reply, db, log) => {
	return await require('../handlers/proposal/create')(request, reply, db, log)
}

const proposal_close_unit = async(request, reply, db, log) => {
	return await require('../handlers/proposal/close')(request, reply, db, log)
}

const proposal_delete_unit = async(request, reply, db, log) => {
	return await require('../handlers/proposal/delete')(request, reply, db, log)
}

// integration tests
const reset_test_data = function () {
 	test_config()
	return require('./.testdata.json')
}

const ballot_read_integration = async (ballot_id) => {
	return await api_proposal_client.ballot_read({ ballot_id })
}

const ballot_create_integration = async ({proposal_id, membership_id, ballot_approved, ballot_comments}) => {
       return await api_proposal_client.ballot_create({
       	proposal_id,
       	membership_id,
       	ballot_approved,
       	ballot_comments
       })
}

const ballot_update_integration = async ({ ballot_id, proposal_id, membership_id, ballot_approved, ballot_comments }) => {
	return await api_proposal_client.ballot_update({
		ballot_id,
		proposal_id,
		membership_id,
		ballot_approved,
		ballot_comments
	})
}

const ballot_delete_integration = async (ballot_id, proposal_id) => {
	return await api_proposal_client.ballot_delete({ ballot_id, proposal_id })
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
	get_dummy_db,
	get_dummy_api,
	get_dummy_log,
	get_dummy_reply,
	reset_test_data,
	ballot_read_unit,
	ballot_create_unit,
	ballot_update_unit,
	ballot_delete_unit,
	proposal_read_unit,
	proposal_create_unit,
	proposal_delete_unit,
	proposal_close_unit,
	ballot_read_integration,
	ballot_create_integration,
	ballot_update_integration,
	ballot_delete_integration,
	proposal_read_integration,
	proposal_create_integration,
	proposal_delete_integration,
	proposal_close_integration
}


