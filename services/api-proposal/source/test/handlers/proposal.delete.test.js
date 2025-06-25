const {
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	proposal_delete_unit: prop_del_u,
	integration_test_setup,
	proposal_read_integration: prop_read_i,
	proposal_delete_integration: prop_del_i
} = require('../helper') 

describe('Proposal Delete', () => {

	describe('Unit Tests', () => {

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = { proposal_id: '00000000-0000-0000-0000-000000000000' }
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{id: dummy_req.proposal_id}],
				val: [{}],
				call: 1
			},{
				fxn: 'where',
				args: [{proposal_id: dummy_req.proposal_id}],
				val: [],
				call: 2
			},{
				fxn: 'del',
				args: [],
				val: []
			}])

			// call handler
			await prop_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(204)
			expect(dummy_reply.send).toBeCalledWith()

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)	
		})

		// error: invalid proposal
		test('Error: Invalid proposal', async() => {

			// set up mocks
			const dummy_req = { proposal_id: '00000000-0000-0000-0000-000000000000' }
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{id: dummy_req.proposal_id}],
				val: [],
				call: 1
			}])

			// call handler
			await prop_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.proposal_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)	
		})
			
		// error: ballots have been cast
		test('Error: Ballots have been cast', async() => {

			// set up mocks
			const dummy_req = { proposal_id: '00000000-0000-0000-0000-000000000000' }
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{id: dummy_req.proposal_id}],
				val: [{}],
				call: 1
			},{
				fxn: 'where',
				args: [{proposal_id: dummy_req.proposal_id}],
				val: [{}]
			}])

			// call handler
			await prop_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.ballots_cast))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)	
		})
			
		// error: db deletion failure
		test('Error: DB deletion failure', async() => {

			// set up mocks
			const dummy_req = { proposal_id: '00000000-0000-0000-0000-000000000000' }
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([])
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [{id: dummy_req.proposal_id}],
				val: [{}],
				call: 1
			},{
				fxn: 'where',
				args: [{proposal_id: dummy_req.proposal_id}],
				val: [],
				call: 2
			},{
				fxn: 'del',
				args: [],
				val: [],
				err: true
			}])

			// call handler
			await prop_del_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			const prop_id = test_data['proposal']['gchild_content_close']['id']
			await expect(prop_read_i(prop_id)).resolves.toBeInstanceOf(Object)
			await prop_del_i(prop_id)	
			await expect(prop_read_i(prop_id)).rejects.toThrow(new Error(errors.proposal_dne))
		})
	
		// error: invalid proposal_id
		test('Error: Invalid proposal id', async () => {
			await expect(prop_del_i('301d37ea-6597-4ec1-8491-6175220089f2'))
				.rejects.toThrow(new Error(errors.proposal_dne))
		})
		
		// error: ballots have been cast
		test('Error: Ballots have been cast', async () => {
			await expect(prop_del_i(test_data['proposal']['root_conduct_fail']['id']))
				.rejects.toThrow(new Error(errors.ballots_cast))
		})
	})
})

