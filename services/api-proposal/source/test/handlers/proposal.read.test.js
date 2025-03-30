const {
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	proposal_read_unit: prop_read_u,
	integration_test_setup,
	proposal_read_integration: prop_read_i
} = require('../helper')

describe('Proposal Read', () => {

	describe('Unit Tests', () => {

		test('Success: No votes', async() => {

			// set up mocks
			const dummy_req = { proposal_id:'00000000-0000-0000-0000-000000000000' }
			let expected = {
				proposal_id: dummy_req.proposal_id,
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000',
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'target',
				proposal_changes: {},
				proposal_votable: true,
				proposal_passed: false,
				date_created: '2100-01-01T00:00:00', 
				date_updated: '2100-01-01T00:00:00'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: dummy_req.proposal_id }],
				val: [expected],
				call_no: 1
			},{
				fxn: 'where',
				args: [{ proposal_id: dummy_req.proposal_id }],
				val: []
			}])

			// call handler
			await prop_read_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expected.proposal_votes = {
				unverified: { no: 0, yes: 0 },
				verified: { no: 0, yes: 0 }
			}
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith(expected)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Success: Cast votes', async() => {

			// set up mocks
			const dummy_req = { proposal_id:'00000000-0000-0000-0000-000000000000' }
			let expected = {
				proposal_id: dummy_req.proposal_id,
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000',
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'target',
				proposal_changes: {},
				proposal_votable: true,
				proposal_passed: false,
				date_created: '2100-01-01T00:00:00', 
				date_updated: '2100-01-01T00:00:00'
			}
			const ballots = [{
				is_approved: true,
				is_verified: true,
				cnt: 1
			},{
				is_approved: true,
				is_verified: false,
				cnt: 2
			},{
				is_approved: false,
				is_verified: true,
				cnt: 3
			},{
				is_approved: false,
				is_verified: false,
				cnt: 4
			}]
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: dummy_req.proposal_id }],
				val: [expected],
				call_no: 1
			},{
				fxn: 'where',
				args: [{ proposal_id: dummy_req.proposal_id }],
				val: ballots
			}])

			// call handler
			await prop_read_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expected.proposal_votes = {
				unverified: { no: 4, yes: 2 },
				verified: { no: 3, yes: 1 }
			}
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith(expected)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		// error: proposal dne
		test('Error: proposal DNE', async() => {

			// set up mocks
			const dummy_req = { proposal_id:'00000000-0000-0000-0000-000000000000' }
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: dummy_req.proposal_id }],
				val: []
			}])

			// call handler
			await prop_read_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.proposal_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: proposal lookup error
		test('Error: proposal lookup error', async() => {

			// set up mocks
			const dummy_req = { proposal_id:'00000000-0000-0000-0000-000000000000' }
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{ id: dummy_req.proposal_id }],
				val: [],
				err: true
			}])

			// call handler
			await prop_read_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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

		const test_data = integration_test_setup()

		// success
		test('Success', async () => {
			let test_prop = test_data['proposal']['root_name_failed']
			const prop = await prop_read_i(test_prop.id)
			expect(prop.proposal_id).toBe(test_prop.id)
			expect(prop.democracy_id).toBe(test_prop.democracy_id)
			expect(prop.membership_id).toBe(test_prop.membership_id)
			expect(prop.proposal_name).toBe(test_prop.name)
			expect(prop.proposal_description).toBe(test_prop.description)
			expect(prop.proposal_target).toBe(test_prop.target)
			expect(prop.proposal_changes).toMatchObject(test_prop.changes)
			expect(prop.proposal_votable).toBe(false)
			expect(prop.proposal_passed).toBe(false)
			expect(prop.proposal_votes.unverified.no).toBe(0)
			expect(prop.proposal_votes.unverified.yes).toBe(1)
			expect(prop.proposal_votes.verified.no).toBe(2)
			expect(prop.proposal_votes.verified.yes).toBe(0)
		})

		// TODO: success: no votes cast
	
		// error: invalid proposal id
		test('Error: Invalid proposal id', async () => {
			await expect(prop_read_i('d3a48d83-eace-4097-bdd9-c0116b7f1475'))
				.rejects.toThrow(new Error(errors.proposal_dne))
		})
	})
})
