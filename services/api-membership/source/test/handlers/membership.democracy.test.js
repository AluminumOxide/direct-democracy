const {
	errors,
	get_uuid,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	democracy_members_unit: dem_mem_u,
	democracy_members_integration: dem_mem_i,
	membership_list_integration: mem_list_i
} = require('../helper')

describe('Democracy Membership', () => {

        describe('Unit Tests', () => {

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = {democracy_id: get_uuid(), members:[get_uuid()]}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: false,
				val: [],
				err: false
			},{
				fxn: 'whereIn',
				args: false,
				val: [get_uuid()],
				err: false
			},{
				fxn: 'returning',
				args: false,
				val: [get_uuid()],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {},
				err: false
			}])

			// call handler
			await dem_mem_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith()
			expect(dummy_reply.code).toHaveBeenCalledWith(201)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: invalid democracy id
		test('Error: Invalid democracy ID', async() => {

			// set up mocks
			const dummy_req = {democracy_id: get_uuid(), members:[get_uuid()]}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: errors.democracy_dne,
				err: true
			}])

			// call handler
			await dem_mem_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.democracy_dne))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		// error: no members
		test('Error: No members', async() => {

			// set up mocks
			const dummy_req = {democracy_id: get_uuid(), members:[]}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([])

			// call handler
			await dem_mem_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_dne))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		// error: democracy lookup failure
		test('Error: Democracy lookup failure', async() => {

			// set up mocks
			const dummy_req = {democracy_id: get_uuid(), members:[get_uuid()]}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: new Error(),
				err: true
			}])

			// call handler
			await dem_mem_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		// error: membership lookup failure	
		test('Error: Membership lookup failure', async() => {

			// set up mocks
			const dummy_req = {democracy_id: get_uuid(), members:[get_uuid()]}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: false,
				val: [{}],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {},
				err: false
			}])

			// call handler
			await dem_mem_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.democracy_dne))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: profile lookup failure
		test('Error: Membership lookup failure', async() => {

			// set up mocks
			const dummy_req = {democracy_id: get_uuid(), members:[get_uuid()]}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: false,
				val: [],
				err: false
			},{
				fxn: 'whereIn',
				args: false,
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {},
				err: false
			}])

			// call handler
			await dem_mem_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		// error: membership creation failure
		test('Error: Membership creation failure', async() => {

			// set up mocks
			const dummy_req = {democracy_id: get_uuid(), members:[get_uuid()]}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: false,
				val: [],
				err: false
			},{
				fxn: 'whereIn',
				args: false,
				val: [get_uuid()],
				err: false
			},{
				fxn: 'returning',
				args: false,
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {},
				err: false
			}])

			// call handler
			await dem_mem_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
	})

	describe('Integration Tests', () => {
	
		const test_data = integration_test_setup()

		// success: single member
		test('Success: Single', async() => {
			await dem_mem_i({
				democracy_id: test_data.democracy.new_child.id,
				members: [test_data.membership.verified_root_1.id]
			})
			const dems = await mem_list_i({ filter: {
				democracy_id: { op: '=', val: test_data.democracy.new_child.id },
				profile_id: { op: '=', val: test_data.membership.verified_root_1.profile_id }
			}})
			expect(dems.length).toBe(1)
		})

		// success: multi members
		test('Success: Multi', async() => {
			await dem_mem_i({
				democracy_id: test_data.democracy.new_child.id,
				members: [
					test_data.membership.verified_root_1.id,
					test_data.membership.verified_root_2.id,
					test_data.membership.verified_root_3.id
				]
			})
			const dems = await mem_list_i({ filter: {
				democracy_id: { op: '=', val: test_data.democracy.new_child.id },
				profile_id: { op: 'IN', val: [
					test_data.membership.verified_root_1.profile_id,
					test_data.membership.verified_root_2.profile_id,
					test_data.membership.verified_root_3.profile_id
				]}
			}})
			expect(dems.length).toBe(3)
		})

		// error: invalid democracy id
		test('Error: Invalid democracy id', async() => {
			await expect(dem_mem_i({
				democracy_id: get_uuid(),
				members: [test_data.membership.verified_root_1.id]
			})).rejects.toThrow(new Error(errors.democracy_dne))
		})

		// error: no members
		test('Error: No members', async() => {
			await expect(dem_mem_i({
				democracy_id: test_data.democracy.root_child.id,
				members: []
			})).rejects.toThrow(new Error(errors.membership_dne))
		})

		// error: pre-existing memberships
		test('Error: Pre-existing memberships', async() => {
			await expect(dem_mem_i({
				democracy_id: test_data.democracy.root.id,
				members: [test_data.membership.verified_root_1.id]
			})).rejects.toThrow(new Error(errors.democracy_dne))
		})
	})
})
