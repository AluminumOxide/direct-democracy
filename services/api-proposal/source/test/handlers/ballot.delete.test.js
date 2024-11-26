const {
	errors,
	get_dummy_api,
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
			let bltid = test_data['ballot']['rcf_dv_1']['id']
			let propid = test_data['ballot']['rcf_dv_1']['proposal_id']
			await expect(blt_read_i(bltid)).resolves.toBeInstanceOf(Object)
			await blt_del_i(bltid, propid)
			await expect(blt_read_i(bltid)).rejects.toThrow(new Error(errors.ballot_dne))
		})

		// error: invalid ballot_id
		test('Error: Invalid ballot id', async () => {
			let propid = test_data['ballot']['rcf_dv_1']['proposal_id']
			await expect(blt_del_i(propid, propid))
				.rejects.toThrow(new Error(errors.ballot_dne))
		})

		// error: invalid proposal_id
		test('Error: Invalid proposal id', async () => {
			let bltid = test_data['ballot']['rcf_dv_1']['id']
			await expect(blt_del_i(bltid, bltid))
				.rejects.toThrow(new Error(errors.ballot_dne))
		})

		// error: ballot not modifiable
		test('Error: Ballot not modifiable', async () => {
			let bltid = test_data['ballot']['rnf_au_1']['id']
			let propid = test_data['ballot']['rnf_au_1']['proposal_id']
			await expect(blt_del_i(bltid, propid))
				.rejects.toThrow(new Error(errors.ballot_closed))
		})
	})
	
	describe('Unit Tests', () => {

		// success
		test('Success', async () => {

			// set up mocks
			const dummy_req = {
				ballot_id: '',
				proposal_id: ''
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'del',
				last_args: [],
				last_val: [],
				throws_error: false
			}])
			get_dummy_api('proposal', [{
				fxn: 'ballot_read',
				val: {
					ballot_modifiable: true,
					proposal_id: dummy_req.proposal_id
				},
				err: false
			}])

			// call handler
			await blt_del_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(204)
			expect(dummy_reply.send).toBeCalledWith()

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: invalid ballot
		test('Error: Invalid ballot', async () => {

			// set up mocks
			const dummy_req = {
				ballot_id: '',
				proposal_id: ''
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'ballot_read',
				val: new Error(errors.ballot_dne),
				err: true
			}])

			// call handler
			await blt_del_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.ballot_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: invalid proposal
		test('Error: Invalid proposal', async () => {

			// set up mocks
			const dummy_req = {
				ballot_id: '00000000-0000-0000-0000-000000000000',
				proposal_id: '00000000-0000-0000-0000-000000000000'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'del',
				last_args: [],
				last_val: [],
				throws_error: false
			}])
			get_dummy_api('proposal', [{
				fxn: 'ballot_read',
				val: {
					ballot_modifiable: true,
					proposal_id: ''
				},
				err: false
			}])

			// call handler
			await blt_del_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.ballot_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: ballot lookup failure
		test('Error: Ballot lookup failure', async () => {

			// set up mocks
			const dummy_req = {
				ballot_id: '',
				proposal_id: ''
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'ballot_read',
				val: new Error(errors.internal_error),
				err: true
			}])

			// call handler
			await blt_del_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		// error: ballot not modifiable
		test('Error: Ballot not modifiable', async () => {

			// set up mocks
			const dummy_req = {
				ballot_id: '',
				proposal_id: ''
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'ballot_read',
				val: {
					ballot_modifiable: false,
					proposal_id: dummy_req.proposal_id
				},
				err: false
			}])

			// call handler
			await blt_del_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.ballot_closed))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: db failure
		test('Error: DB failure', async () => {

			// set up mocks
			const dummy_req = {
				ballot_id: '',
				proposal_id: ''
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'del',
				last_args: [],
				last_val: [],
				throws_error: true
			}])
			get_dummy_api('proposal', [{
				fxn: 'ballot_read',
				val: {
					ballot_modifiable: true,
					proposal_id: dummy_req.proposal_id
				},
				err: false
			}])

			// call handler
			await blt_del_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
