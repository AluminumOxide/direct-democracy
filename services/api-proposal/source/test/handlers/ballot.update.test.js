const {
	errors,
	get_dummy_lib,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	integration_test_setup,
	ballot_update_unit: blt_update_u,
	ballot_update_integration: blt_update_i
} = require('../helper') 
	
describe('Ballot Update', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		// success
		test('Success', async () => {
			const test_blt = {
				ballot_id: test_data['ballot'][ 'cmp_av_2']['id'],
				proposal_id: test_data['ballot']['cmp_av_2']['proposal_id'],
				membership_id: test_data['ballot'][ 'cmp_av_2']['membership_id'],
				ballot_approved: false,
				ballot_comments: 'qwer'
			}
			await expect(blt_update_i(test_blt)).resolves.toMatchObject(test_blt)
		})

		// error: invalid ballot id
		test('Error: Invalid ballot id', async () => {
			const test_blt = {
				ballot_id: test_data['ballot'][ 'cmp_au_2']['membership_id'],
				proposal_id: test_data['ballot']['cmp_au_2']['proposal_id'],
				membership_id: test_data['ballot'][ 'cmp_au_2']['membership_id'],
				ballot_approved: false,
				ballot_comments: 'qwer'
			}
			await expect(blt_update_i(test_blt)).rejects.toThrow(new Error(errors.ballot_dne))
		})

		// error: invalid proposal id
		test('Error: Invalid proposal id', async () => {
			const test_blt = {
				ballot_id: test_data['ballot'][ 'cmp_au_2']['id'],
				proposal_id: test_data['ballot'][ 'cmp_au_2']['id'],
				membership_id: test_data['ballot'][ 'cmp_au_2']['membership_id'],
				ballot_approved: false,
				ballot_comments: 'qwer'
			}
			await expect(blt_update_i(test_blt)).rejects.toThrow(new Error(errors.proposal_dne))
		})

		// error: invalid membership id
		test('Error: Invalid membership id', async () => {
			const test_blt = {
				ballot_id: test_data['ballot'][ 'cmp_au_2']['id'],
				proposal_id: test_data['ballot']['cmp_au_2']['proposal_id'],
				membership_id: test_data['ballot']['cmp_au_2']['proposal_id'],
				ballot_approved: false,
				ballot_comments: 'qwer'
			}
			await expect(blt_update_i(test_blt)).rejects.toThrow(new Error(errors.membership_dne))
		})

		// error: invalid ballot approved
		test('Error: Invalid ballot approved', async () => {
			const test_blt = {
				ballot_id: test_data['ballot'][ 'cmp_au_2']['id'],
				proposal_id: test_data['ballot']['cmp_au_2']['proposal_id'],
				membership_id: test_data['ballot'][ 'cmp_au_2']['membership_id'],
				ballot_approved: 'qwer',
				ballot_comments: 'qwer'
			}
			await expect(blt_update_i(test_blt)).rejects.toThrow(new Error(errors._invalid_body))
		})
	})

	// TODO: why does this fail if unit tests are first?
	describe('Unit Tests', () => {

		// success
		test('Success', async() => {

			// set up mocks
			let expected = {
				id: '3a615a09-6f1f-45c0-ac42-112171ccfc01',
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				is_approved: true,
				comments: 'test test',
				modifiable: true,
				date_created: '2014-01-23T07:46:39',
				date_updated: '2027-02-05T03:43:59'
			}
			const dummy_req = {
				ballot_id: expected.id,
				proposal_id: expected.proposal_id,
				membership_id: expected.membership_id,
				ballot_approved: expected.is_approved,
				ballot_comments: expected.comments
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				fxn: 'returning',
				args: ['*'],
				val: [expected],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { proposal_votable: true },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { ballot_modifiable: true, membership_id: expected.membership_id },
				err: false
			}], errors)

			// call handler
			await blt_update_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expected.ballot_id = expected.id
			expected.ballot_approved = expected.is_approved
			expected.ballot_comments = expected.comments
			expected.ballot_modifiable = expected.modifiable
			delete expected.id
			delete expected.is_approved
			delete expected.comments
			delete expected.modifiable
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith(expected)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: invalid proposal id
		test('Error: Invalid proposal ID', async() => {

			// set up mocks
			const dummy_req = {
				ballot_id: '3a615a09-6f1f-45c0-ac42-112171ccfc01',
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: errors.proposal_dne,
				err: true
			}], errors)

			// call handler
			await blt_update_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.proposal_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: proposal lookup failure
		test('Error: Proposal not votable', async() => {

			// set up mocks
			const dummy_req = {
				ballot_id: '3a615a09-6f1f-45c0-ac42-112171ccfc01',
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: errors.internal_error,
				err: true
			}], errors)

			// call handler
			await blt_update_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		// error: proposal is not votable
		test('Error: Proposal not votable', async() => {

			// set up mocks
			const dummy_req = {
				ballot_id: '3a615a09-6f1f-45c0-ac42-112171ccfc01',
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { proposal_votable: false },
				err: false
			}], errors)

			// call handler
			await blt_update_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.voting_closed))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: invalid ballot id
		test('Error: Invalid ballot ID', async() => {

			// set up mocks
			const dummy_req = {
				ballot_id: '3a615a09-6f1f-45c0-ac42-112171ccfc01',
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { proposal_votable: true },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: errors.ballot_dne,
				err: true
			}], errors)

			// call handler
			await blt_update_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply

			expect(dummy_reply.send).toBeCalledWith(new Error(errors.ballot_dne))
			expect(dummy_reply.code).toBeCalledWith(400)

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: ballot lookup failure
		test('Error: Ballot lookup failure', async() => {

			// set up mocks
			const dummy_req = {
				ballot_id: '3a615a09-6f1f-45c0-ac42-112171ccfc01',
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { proposal_votable: true },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: errors.internal_error,
				err: true
			}], errors)

			// call handler
			await blt_update_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		// error: ballot not modifiable
		test('Error: Ballot not modifiable', async() => {

			// set up mocks
			const dummy_req = {
				ballot_id: '3a615a09-6f1f-45c0-ac42-112171ccfc01',
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { proposal_votable: true },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { ballot_modifiable: false, membership_id: dummy_req.membership_id },
				err: false
			}], errors)

			// call handler
			await blt_update_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.ballot_closed))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: invalid membership id
		test('Error: Invalid membership ID', async() => {

			// set up mocks
			const dummy_req = {
				ballot_id: '3a615a09-6f1f-45c0-ac42-112171ccfc01',
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { proposal_votable: true },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { ballot_modifiable: true, membership_id: dummy_req.ballot_id },
				err: false
			}], errors)

			// call handler
			await blt_update_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.membership_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: update failure
		test('Error: Update failure', async() => {

			// set up mocks
			const dummy_req = {
				ballot_id: '3a615a09-6f1f-45c0-ac42-112171ccfc01',
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				fxn: 'returning',
				args: ['*'],
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { proposal_votable: true },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { ballot_modifiable: true, membership_id: dummy_req.membership_id },
				err: false
			}], errors)

			// call handler
			await blt_update_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		// error: db failure
		test('Error: DB failure', async() => {

			// set up mocks
			const dummy_req = {
				ballot_id: '3a615a09-6f1f-45c0-ac42-112171ccfc01',
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				fxn: 'returning',
				args: ['*'],
				val: [],
				err: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { proposal_votable: true },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: { ballot_modifiable: true, membership_id: dummy_req.membership_id },
				err: false
			}], errors)

			// call handler
			await blt_update_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})


})
