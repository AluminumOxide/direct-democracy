const {
	errors,
	get_dummy_lib,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	integration_test_setup,
	ballot_delete_unit: blt_del_u,
	ballot_read_integration: blt_read_i,
	ballot_delete_integration: blt_del_i
} = require('../helper') 
	
describe('Ballot Delete', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		// success
		test('Success', async () => {
			let blt = test_data['ballot']['rcf_dv_1']
			let memid = blt.membership_id
			let propid = blt.proposal_id
			await expect(blt_read_i(propid, memid)).resolves.toBeInstanceOf(Object)
			await blt_del_i(propid, memid)
			await expect(blt_read_i(propid, memid)).rejects.toThrow(new Error(errors.ballot_dne))
		})

		// error: invalid ballot_id
		test('Error: Invalid membership id', async () => {
			let propid = test_data['ballot']['rcf_dv_1']['proposal_id']
			await expect(blt_del_i(propid, propid))
				.rejects.toThrow(new Error(errors.ballot_dne))
		})

		// error: invalid proposal_id
		test('Error: Invalid proposal id', async () => {
			let bltid = test_data['ballot']['rcf_dv_1']['membership_id']
			await expect(blt_del_i(bltid, bltid))
				.rejects.toThrow(new Error(errors.ballot_dne))
		})

		// error: ballot not modifiable
		test('Error: Ballot not modifiable', async () => {
			let memid = test_data['ballot']['rnf_au_1']['membership_id']
			let propid = test_data['ballot']['rnf_au_1']['proposal_id']
			await expect(blt_del_i(propid, memid))
				.rejects.toThrow(new Error(errors.ballot_closed))
		})
	})
	
	describe('Unit Tests', () => {

		// success
		test('Success', async () => {

			// set up mocks
			const dummy_req = {
				membership_id: '',
				proposal_id: ''
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				fxn: 'del',
				args: [],
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: {
					ballot_modifiable: true,
					proposal_id: dummy_req.proposal_id
				},
				err: false
			}])

			// call handler
			await blt_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(204)
			expect(dummy_reply.send).toHaveBeenCalledWith()

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: invalid ballot
		test('Error: Invalid ballot', async () => {

			// set up mocks
			const dummy_req = {
				membership_id: '',
				proposal_id: ''
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: errors.ballot_dne,
				err: true
			}])

			// call handler
			await blt_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.ballot_dne))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: ballot lookup failure
		test('Error: Ballot lookup failure', async () => {

			// set up mocks
			const dummy_req = {
				membership_id: '',
				proposal_id: ''
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: errors.internal_error,
				err: true
			}])

			// call handler
			await blt_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		// error: ballot not modifiable
		test('Error: Ballot not modifiable', async () => {

			// set up mocks
			const dummy_req = {
				membership_id: '',
				proposal_id: ''
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: {
					ballot_modifiable: false,
					proposal_id: dummy_req.proposal_id
				},
				err: false
			}])

			// call handler
			await blt_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.ballot_closed))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: db failure
		test('Error: DB failure', async () => {

			// set up mocks
			const dummy_req = {
				membership_id: '',
				proposal_id: ''
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				fxn: 'del',
				args: [],
				val: [],
				err: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_proposal',
				fxn: 'ballot_read',
				val: {
					ballot_modifiable: true,
					proposal_id: dummy_req.proposal_id
				},
				err: false
			}])

			// call handler
			await blt_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
	})
})
