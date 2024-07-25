const {
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	reset_test_data,
	ballot_read_unit: blt_read_u,
	ballot_read_integration: blt_read_i
} = require('../helper') 
	
describe('Ballot Read', () => {
	
	describe('Integration Tests', () => {

		const test_data = reset_test_data()

		// success
		test('Success', async () => {
			let test_blt = test_data['ballot']['rnf_au_1']
			const blt = await blt_read_i(test_blt.id)
			expect(blt.proposal_id).toBe(test_blt.proposal_id)
			expect(blt.membership_id).toBe(test_blt.membership_id)
			expect(blt.ballot_approved).toBeTruthy()
			expect(blt.ballot_comments).toBe(test_blt.comments)
			expect(blt.ballot_modifiable).toBeFalsy()
		})

		// error: invalid ballot id
		test('Error: Invalid ballot id', async () => {
			await expect(blt_read_i('3bfe9d51-f065-4774-9d7d-3904d8128098'))
				.rejects.toThrow(new Error(errors.ballot_dne))
		})
	})

	describe('Unit Tests', () => {

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = { ballot_id: '' }
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ 'id': dummy_req.ballot_id }],
				last_val: [{ 'ballot_id': dummy_req.ballot_id }],
				throws_error: false
			}])

			// call handler
			await blt_read_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith({ 'ballot_id': dummy_req.ballot_id })

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: ballot dne
		test('Error: Ballot DNE', async() => {

			// set up mocks
			const dummy_req = { ballot_id: '' }
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ 'id': dummy_req.ballot_id }],
				last_val: [],
				throws_error: false
			}])

			// call handler
			await blt_read_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.ballot_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: db failure
		test('Error: DB failure', async() => {

			// set up mocks
			const dummy_req = { ballot_id: '' }
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: [{ 'id': dummy_req.ballot_id }],
				last_val: [],
				throws_error: true
			}])

			// call handler
			await blt_read_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
