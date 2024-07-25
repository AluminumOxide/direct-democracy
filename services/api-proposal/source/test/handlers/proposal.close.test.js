const {
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	reset_test_data,
	proposal_close_unit: prop_close_u,
	proposal_read_integration: prop_read_i,
	proposal_close_integration: prop_close_i
} = require('../helper')

describe('Proposal Close', () => {

	describe('Unit Tests', () => {

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = {
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				passed: true
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{id: dummy_req.proposal_id}],
				last_val: [{proposal_votable: true}],
				throws_error: false,
				call_no: 1
			},{
				last_fxn: 'returning',
				last_args: ["*"],
				last_val: [{}],
				throws_error: false
			}])

			// call handler
			await prop_close_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith()

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: proposal dne
		test('Error: Invalid proposal', async() => {

			// set up mocks
			const dummy_req = {
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				passed: true
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{id: dummy_req.proposal_id}],
				last_val: [],
				throws_error: false
			}])

			// call handler
			await prop_close_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.proposal_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: db lookup error
		test('Error: DB lookup error', async() => {

			// set up mocks
			const dummy_req = {
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				passed: true
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{id: dummy_req.proposal_id}],
				last_val: [],
				throws_error: true
			}])

			// call handler
			await prop_close_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		// error: proposal closed
		test('Error: Proposal closed', async() => {

			// set up mocks
			const dummy_req = {
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				passed: true
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{id: dummy_req.proposal_id}],
				last_val: [{proposal_votable: false}],
				throws_error: false
			}])

			// call handler
			await prop_close_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.voting_closed))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		// error: db update failure
		test('Error: DB update failure', async() => {

			// set up mocks
			const dummy_req = {
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				passed: true
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{id: dummy_req.proposal_id}],
				last_val: [{proposal_votable: true}],
				throws_error: false,
				call_no: 1
			},{
				last_fxn: 'returning',
				last_args: ["*"],
				last_val: [],
				throws_error: false
			}])

			// call handler
			await prop_close_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		// error: db update error
		test('Error: DB update error', async() => {

			// set up mocks
			const dummy_req = {
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				passed: true
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{id: dummy_req.proposal_id}],
				last_val: [{proposal_votable: true}],
				throws_error: false,
				call_no: 1
			},{
				last_fxn: 'returning',
				last_args: ["*"],
				last_val: [],
				throws_error: true
			}])

			// call handler
			await prop_close_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})

	describe('Integration Tests', () => {

		const test_data = reset_test_data()
	
		// success: close passed proposal
		test('Success: Passed', async () => {		
			let test_prop = test_data['proposal']['gchild_content_close']
			await expect(prop_read_i(test_prop.id)).resolves.toMatchObject({
				'proposal_votable': true,
				'proposal_passed': null
			})
			await prop_close_i(test_prop.id, true)
			await expect(prop_read_i(test_prop.id)).resolves.toMatchObject({
				'proposal_votable': false,
				'proposal_passed': true
			})
		})
	
		// success: close failed proposal
		test('Success: Failed', async () => {		
			let test_prop = test_data['proposal']['root_conduct_fail']
			await expect(prop_read_i(test_prop.id)).resolves.toMatchObject({
				'proposal_votable': true,
				'proposal_passed': null
			})
			await prop_close_i(test_prop.id, false)
			await expect(prop_read_i(test_prop.id)).resolves.toMatchObject({
				'proposal_votable': false,
				'proposal_passed': false
			})
		})
	
		// error: invalid proposal id
		test('Error: Invalid proposal_id', async () => {
			await expect(prop_close_i('01cad47c-3ad2-4b95-aa50-fb1b835fda61', true))
				.rejects.toThrow(new Error(errors.proposal_dne))
		})
	
		// error: already closed
		test('Error: Already closed', async () => {
			await expect(prop_close_i(test_data['proposal']['child_desc_passed']['id'], true))
				.rejects.toThrow(new Error(errors.voting_closed))
		})
	})
})

