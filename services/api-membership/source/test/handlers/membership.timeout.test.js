const {
	errors,
	get_uuid,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	integration_test_setup,
	membership_timeout_unit: mem_timeout_u,
	membership_read_integration: mem_read_i,
	membership_timeout_integration: mem_timeout_i
} = require('../helper')

describe('Membership Timeout', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()
		
		const proposal_id = get_uuid() 
		let new_date = new Date()
		new_date = new_date.setDate(new_date.getDate() + 5)
		const dy = new Date(new_date).getDate()
		const mo = new Date(new_date).getMonth()
		const yr = new Date(new_date).getFullYear()

		// success: not in timeout
		test('Success', async () => {
			const test_mem = test_data['membership']['unverified_root_1']
			const t = await mem_timeout_i(test_mem.id, 5, proposal_id)
			const mem = await mem_read_i(test_mem.id)
			const cmem = await mem_read_i(test_data.membership.verified_child_1.id)
			const gmem = await mem_read_i(test_data.membership.verified_grandchild_1.id)
			expect((new Date(mem.timeout_end)).getDate()).toBe(dy)
			expect((new Date(mem.timeout_end)).getMonth()).toBe(mo)
			expect((new Date(mem.timeout_end)).getFullYear()).toBe(yr)
			expect((new Date(cmem.timeout_end)).getDate()).toBe(1)
			expect((new Date(cmem.timeout_end)).getMonth()).toBe(0)
			expect((new Date(cmem.timeout_end)).getFullYear()).toBe(2100)
			expect((new Date(gmem.timeout_end)).getDate()).toBe(dy)
			expect((new Date(gmem.timeout_end)).getMonth()).toBe(mo)
			expect((new Date(gmem.timeout_end)).getFullYear()).toBe(yr)
			expect(mem.timeout_count).toBe(test_mem.timeout_count+1)
			expect(mem.timeout_total).toBe(test_mem.timeout_total+5)
			expect(Object.keys(mem.timeout_history).length).toBe(1)
			expect(Object.keys(cmem.timeout_history).length).toBe(2)
			expect(Object.keys(gmem.timeout_history).length).toBe(1)
		})

		// success: already in timeout
		test('Success: Already in timeout', async () => {
			const test_mem = test_data['membership']['verified_child_1']
			const t = await mem_timeout_i(test_mem.id, 5, proposal_id)
			const mem = await mem_read_i(test_mem.id)
			const gmem = await mem_read_i(test_data.membership.verified_grandchild_1.id)
			expect((new Date(mem.timeout_end)).getDate()).toBe(6)
			expect((new Date(mem.timeout_end)).getMonth()).toBe(0)
			expect((new Date(mem.timeout_end)).getFullYear()).toBe(2100)
			expect((new Date(gmem.timeout_end)).getDate()).toBe(6)
			expect((new Date(gmem.timeout_end)).getMonth()).toBe(0)
			expect((new Date(gmem.timeout_end)).getFullYear()).toBe(2100)
			expect(mem.timeout_count).toBe(test_mem.timeout_count+1)
			expect(mem.timeout_total).toBe(test_mem.timeout_total+5)
			expect(Object.keys(mem.timeout_history).length).toBe(2)
			expect(Object.keys(gmem.timeout_history).length).toBe(1)
		})

		// success: expired timeout
		test('Success: Expired timeout', async () => {
			const test_mem = test_data['membership']['verified_root_4']
			const t = await mem_timeout_i(test_mem.id, 5, proposal_id)
			const mem = await mem_read_i(test_mem.id)
			expect((new Date(mem.timeout_end)).getDate()).toBe(dy)
			expect((new Date(mem.timeout_end)).getMonth()).toBe(mo)
			expect((new Date(mem.timeout_end)).getFullYear()).toBe(yr)
			expect(mem.timeout_count).toBe(test_mem.timeout_count+1)
			expect(mem.timeout_total).toBe(test_mem.timeout_total+5)
			expect(Object.keys(mem.timeout_history).length).toBe(2)
		})

		// error: no id
		test('Error: No membership id', async () => {
			await expect(mem_timeout_i({}))
				.rejects.toThrow(new Error(errors._invalid_param))
		})

		// error: non-uuid id
		test('Error: Non-uuid membership id', async () => {
			await expect(mem_timeout_i('bad-val', 1, get_uuid()))
				.rejects.toThrow(new Error(errors._invalid_param))
		})

		// error: invalid id
		test('Error: Invalid membership id', async () => {
			await expect(mem_timeout_i(get_uuid(), 1, get_uuid()))
				.rejects.toThrow(new Error(errors.membership_dne))
		})
	})

	describe('Unit Tests', () => {

		// success
		test('Success: No previous timeout', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				timeout_days: 5,
				proposal_id: get_uuid()
			}
			const democracy_id = get_uuid()
			const profile_id = get_uuid()
			const mem_id = get_uuid()
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {timeout_end: false, timeout_history: null, profile_id},
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {democracy_children:[]},
				err: false,
				call: 2 
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {democracy_children:[{id: democracy_id }]},
				err: false,
				call: 1
			}], errors)
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			},{
				fxn: 'where',
				args: [{'democracy_id': democracy_id, 'profile_id': profile_id}],
				val: [{ id: mem_id, timeout_end:false, timeout_history:null }],
				err: false
			},{
				fxn: 'where',
				args: ['id', mem_id ],
				val: [],
				err: false
			}])

			// call handler
			await mem_timeout_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(201)
			expect(dummy_reply.send).toHaveBeenCalledWith()

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Success: Expired timeout', async() => {

			// set up mocks
			const democracy_id = get_uuid()
			const profile_id = get_uuid()
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				timeout_days: 5,
				proposal_id: get_uuid()
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {timeout_end: '2000-01-01T00:00:00', timeout_history: [get_uuid()], profile_id},
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {democracy_children:[]},
				err: false,
				call: 2 
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {democracy_children:[{id: democracy_id }]},
				err: false,
				call: 1
			}], errors)
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			},{
				fxn: 'where',
				args: [{'democracy_id': democracy_id, 'profile_id': profile_id}],
				val: [{ id: dummy_req.membership_id, timeout_end: '2000-01-01T00:00:00', timeout_history: [get_uuid()] }],
				err: false
			}])

			// call handler
			await mem_timeout_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(201)
			expect(dummy_reply.send).toHaveBeenCalledWith()

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Success: In timeout', async() => {

			// set up mocks
			const democracy_id = get_uuid()
			const profile_id = get_uuid()
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				timeout_days: 5,
				proposal_id: get_uuid()
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {timeout_end: '2100-01-01T00:00:00', timeout_history: [get_uuid()], profile_id},
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {democracy_children:[]},
				err: false,
				call: 2 
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {democracy_children:[{id: democracy_id }]},
				err: false,
				call: 1
			}], errors)
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			},{
				fxn: 'where',
				args: [{'democracy_id': democracy_id, 'profile_id': profile_id}],
				val: [{ id: dummy_req.membership_id, timeout_end: '2100-01-01T00:00:00', timeout_history: [get_uuid()] }],
				err: false
			}])

			// call handler
			await mem_timeout_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(201)
			expect(dummy_reply.send).toHaveBeenCalledWith()

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Success: No child membership', async() => {

			// set up mocks
			const democracy_id = get_uuid()
			const profile_id = get_uuid()
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				timeout_days: 5,
				proposal_id: get_uuid()
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {timeout_end: '2100-01-01T00:00:00', timeout_history: [get_uuid()], profile_id},
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {democracy_children:[]},
				err: false,
				call: 2 
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {democracy_children:[{id: democracy_id }]},
				err: false,
				call: 1
			}], errors)
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			},{
				fxn: 'where',
				args: [{'democracy_id': democracy_id, 'profile_id': profile_id}],
				val: [],
				err: false
			}])

			// call handler
			await mem_timeout_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(201)
			expect(dummy_reply.send).toHaveBeenCalledWith()

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Membership DNE', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				timeout_days: 5,
				proposal_id: get_uuid()
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: errors.membership_dne,
				err: true
			}], errors)
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			}])

			// call handler
			await mem_timeout_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_dne))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: DB', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				timeout_days: 5,
				proposal_id: get_uuid()
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {timeout_end:null,timeout_history:[]},
				err: false
			}], errors)
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [],
				err: false
			}])

			// call handler
			await mem_timeout_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
		
		test('Error: Internal', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				timeout_days: 5,
				proposal_id: get_uuid()
			}
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: errors.internal_error,
				err: true
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: false,
				err: false
			}], errors)
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			}])

			// call handler
			await mem_timeout_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		test('Error: Democracy lookup failure', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				timeout_days: 5,
				proposal_id: get_uuid()
			}
			const democracy_id = get_uuid()
			const profile_id = get_uuid()
			const mem_id = dummy_req.membership_id
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {timeout_end: null, timeout_history: {}, profile_id},
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: errors.democracy_dne,
				err: true
			}], errors)
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			},{
				fxn: 'where',
				args: [{'democracy_id': democracy_id, 'profile_id': profile_id}],
				val: [],
				err: false
			}])

			// call handler
			await mem_timeout_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.democracy_dne))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Democracy child internal error', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				timeout_days: 5,
				proposal_id: get_uuid()
			}
			const democracy_id = get_uuid()
			const profile_id = get_uuid()
			const mem_id = dummy_req.membership_id
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {timeout_end: null, timeout_history: {}, profile_id},
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: errors.internal_error,
				err: true
			}], errors)
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			},{
				fxn: 'where',
				args: [{'democracy_id': democracy_id, 'profile_id': profile_id}],
				val: [],
				err: false
			}])

			// call handler
			await mem_timeout_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
	
		test('Error: Child update failure', async() => {

			// set up mocks
			const dummy_req = {
				membership_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				timeout_days: 5,
				proposal_id: get_uuid()
			}
			const democracy_id = get_uuid()
			const profile_id = get_uuid()
			const mem_id = dummy_req.membership_id
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: {timeout_end: null, timeout_history: {}, profile_id},
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {democracy_children:[]},
				err: false,
				call: 2 
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: {democracy_children:[{id: democracy_id }]},
				err: false,
				call: 1
			}], errors)
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'returning', 
				args: false,
				val: [dummy_req],
				err: false
			},{
				fxn: 'where',
				args: [{'democracy_id': democracy_id, 'profile_id': profile_id}],
				val: [{ id: mem_id, timeout_end:null, timeout_history:{} }],
				err: false
			},{
				fxn: 'where',
				args: [{'id': mem_id}],
				val: false,
				err: false,
				call: 2
			}])

			// call handler
			await mem_timeout_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
	})
})
