const {
	errors,
	get_dummy_api,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	integration_test_setup,
	ballot_create_unit: blt_create_u,
	ballot_create_integration: blt_create_i
} = require('../helper') 
	
describe('Ballot Create', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		// success
		test('Success', async () => {
			const test_blt = {
				membership_id: test_data['membership']['unverified_child_4']['id'],
				proposal_id: test_data['proposal']['child_metas_pass']['id'],
				ballot_approved: true,
				ballot_comments: 'asdfasdf'
			}
			await expect(blt_create_i(test_blt)).resolves.toMatchObject(test_blt)
		})

		// error: invalid proposal id
		test('Error: Invalid proposal id', async () => {
			const test_blt = {
				membership_id: test_data['membership']['unverified_child_4']['id'],
				proposal_id: test_data['membership']['unverified_child_4']['id'],
				ballot_approved: true,
				ballot_comments: 'asdfasdf'
			}
			await expect(blt_create_i(test_blt)).rejects.toThrow(new Error(errors.proposal_dne))
		})

		// error: invalid membership id
		test('Error: Invalid membership id', async () => {
			const test_blt = {
				membership_id: test_data['proposal']['child_metas_pass']['id'],
				proposal_id: test_data['proposal']['child_metas_pass']['id'],
				ballot_approved: true,
				ballot_comments: 'asdfasdf'
			}
			await expect(blt_create_i(test_blt)).rejects.toThrow(new Error(errors.membership_dne))
		})

		// error: invalid ballot approved
		test('Error: Invalid ballot approved', async () => {
			const test_blt = {
				membership_id: test_data['membership']['unverified_child_4']['id'],
				proposal_id: test_data['proposal']['child_metas_pass']['id'],
				ballot_approved: 'bad',
				ballot_comments: 'asdfasdf'
			}
			await expect(blt_create_i(test_blt)).rejects.toThrow(Error)
		})
	})

	describe('Unit Tests', () => {
		
		// success
		test('Success', async() => {

			// set up mocks
			let expected = {
				id:'3a615a09-6f1f-45c0-ac42-112171ccfc01',
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				is_approved: true,
				comments: 'test test test',
				modifiable: true,
				date_created: '2014-01-23T07:46:39',
				date_updated: '2027-02-05T03:43:59'
			}
			const dummy_req = {
				proposal_id: expected.proposal_id,
				membership_id: expected.membership_id,
				ballot_approved: expected.is_approved,
				ballot_comments: expected.comments
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				last_val: [expected],
				throws_error: false
			}])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: { proposal_votable: true },
				err: false
			}])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: { is_verified: true },
				err: false
			}])

			// call handler
			await blt_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expected.ballot_id = expected.id
			expected.ballot_approved = expected.is_approved
			expected.ballot_comments = expected.comments
			expected.ballot_modifiable = expected.modifiable
			delete expected.id
			delete expected.is_approved
			delete expected.comments
			delete expected.modifiable
			expect(dummy_reply.code).toBeCalledWith(201)
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
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: new Error(errors.proposal_dne),
				err: true
			}])

			// call handler
			await blt_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.proposal_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: proposal lookup error
		test('Error: Proposal lookup error', async() => {

			// set up mocks
			const dummy_req = {
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: new Error(errors.internal_error),
				err: true
			}])

			// call handler
			await blt_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		// error: proposal is not votable
		test('Error: Proposal is not votable', async() => {

			// set up mocks
			const dummy_req = {
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: { proposal_votable: false },
				err: false
			}])

			// call handler
			await blt_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.voting_closed))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: invalid membership id
		test('Error: Invalid membership ID', async() => {

			// set up mocks
			const dummy_req = {
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: { proposal_votable: true },
				err: false
			}])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: new Error(errors.membership_dne),
				err: true
			}])

			// call handler
			await blt_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.membership_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: membership lookup error
		test('Error: Membership lookup error', async() => {

			// set up mocks
			const dummy_req = {
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: { proposal_votable: true },
				err: false
			}])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: new Error(errors.internal_error),
				err: true
			}])

			// call handler
			await blt_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		// error: insertion error
		test('Error: Insertion error', async() => {

			// set up mocks
			const dummy_req = {
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				ballot_approved: true,
				ballot_comments: 'test test test'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				last_val: [],
				throws_error: false
			}])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: { proposal_votable: true },
				err: false
			}])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: { is_verified: true },
				err: false
			}])

			// call handler
			await blt_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
			const expected = {
				id:'3a615a09-6f1f-45c0-ac42-112171ccfc01',
				proposal_id: 'd3a48d83-eace-4097-bdd9-c0116b7f1474',
				membership_id: '9b433f36-9474-4ecd-9261-631f3acb792b',
				is_approved: true,
				comments: 'test test test',
				modifiable: true,
				date_created: '2014-01-23T07:46:39',
				date_updated: '2027-02-05T03:43:59'
			}
			const dummy_req = {
				proposal_id: expected.proposal_id,
				membership_id: expected.membership_id,
				ballot_approved: expected.ballot_approved,
				ballot_comments: expected.ballot_comments
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				last_val: [expected],
				throws_error: true
			}])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: { proposal_votable: true },
				err: false
			}])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: { is_verified: true },
				err: false
			}])

			// call handler
			await blt_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
