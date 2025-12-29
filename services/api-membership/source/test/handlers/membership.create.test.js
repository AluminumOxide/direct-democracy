const {
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	integration_test_setup,
	membership_create_unit: mem_create_u,
	membership_create_integration: mem_create_i
} = require('../helper')

describe('Membership Create', () => {

	describe('Unit Tests', () => {

		// success
		test('Success', async() => {

			// set up mocks
			let expected = {
				id: '3f8d3110-e63c-491f-a1d4-772ded682d8f',
				democracy_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				profile_id: 'acd16c5f-7abe-4ce9-ac3b-a74804af1f58',
				is_verified: false,
				date_created: '2014-01-23T07:46:39',
				date_updated: '2027-02-05T03:43:59'
			}
			const dummy_req = {
				democracy_id: expected.democracy_id,
				profile_id: expected.profile_id
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [dummy_req],
				val: [],
				err: false
			},{
				fxn: 'returning',
				args: ['*'],
				val: [expected],
				err: false
			}])	
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { id: expected.democracy_id },
				err: false
			}], errors)

			// call handler
			await mem_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expected.membership_id = expected.id
			delete expected.id
			expect(dummy_reply.send).toHaveBeenCalledWith(expected)
			expect(dummy_reply.code).toHaveBeenCalledWith(200)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: democracy id invalid
		test('Error: Democracy id invalid', async() => {

			// set up mocks
			let expected = {
				id: '3f8d3110-e63c-491f-a1d4-772ded682d8f',
				democracy_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				profile_id: 'acd16c5f-7abe-4ce9-ac3b-a74804af1f58',
				is_verified: false,
				date_created: '2014-01-23T07:46:39',
				date_updated: '2027-02-05T03:43:59'
			}
			const dummy_req = {
				democracy_id: expected.democracy_id,
				profile_id: expected.profile_id
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [dummy_req],
				val: [],
				err: false
			},{
				fxn: 'returning',
				args: ['*'],
				val: [expected],
				err: false
			}])	
			const dummy_lib = get_dummy_lib([{
				lib:'api_democracy',
				fxn: 'democracy_read',
				val: errors.democracy_dne,
				err: true
			}], errors)

			// call handler
			await mem_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.democracy_dne))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: democracy api failure
		test('Error: Democracy api failure', async() => {

			// set up mocks
			let expected = {
				id: '3f8d3110-e63c-491f-a1d4-772ded682d8f',
				democracy_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				profile_id: 'acd16c5f-7abe-4ce9-ac3b-a74804af1f58',
				is_verified: false,
				date_created: '2014-01-23T07:46:39',
				date_updated: '2027-02-05T03:43:59'
			}
			const dummy_req = {
				democracy_id: expected.democracy_id,
				profile_id: expected.profile_id
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [dummy_req],
				val: [],
				err: false
			},{
				fxn: 'returning',
				args: ['*'],
				val: [expected],
				err: false
			}])	
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: new Error(errors.internal_error),
				err: true
			}], errors)

			// call handler
			await mem_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		// error: pre-existing membership
		test('Error: Membership already exists', async() => {

			// set up mocks
			let expected = {
				id: '3f8d3110-e63c-491f-a1d4-772ded682d8f',
				democracy_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				profile_id: 'acd16c5f-7abe-4ce9-ac3b-a74804af1f58',
				is_verified: false,
				date_created: '2014-01-23T07:46:39',
				date_updated: '2027-02-05T03:43:59'
			}
			const dummy_req = {
				democracy_id: expected.democracy_id,
				profile_id: expected.profile_id
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [dummy_req],
				val: [expected],
				err: false
			},{
				fxn: 'returning',
				args: ['*'],
				val: [expected],
				err: false
			}])	
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { id: expected.democracy_id },
				err: false
			}], errors)

			// call handler
			await mem_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_exist))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// error: db select error
		test('Error: Membership lookup error', async() => {

			// set up mocks
			let expected = {
				id: '3f8d3110-e63c-491f-a1d4-772ded682d8f',
				democracy_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				profile_id: 'acd16c5f-7abe-4ce9-ac3b-a74804af1f58',
				is_verified: false,
				date_created: '2014-01-23T07:46:39',
				date_updated: '2027-02-05T03:43:59'
			}
			const dummy_req = {
				democracy_id: expected.democracy_id,
				profile_id: expected.profile_id
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [dummy_req],
				val: [],
				err: new Error(errors.internal_error)
			},{
				fxn: 'returning',
				args: ['*'],
				val: [expected],
				err: false
			}])	
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { id: expected.democracy_id },
				err: false
			}], errors)

			// call handler
			await mem_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		// error: db insert failure
		test('Error: DB insert failure', async() => {

			// set up mocks
			let expected = {
				id: '3f8d3110-e63c-491f-a1d4-772ded682d8f',
				democracy_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				profile_id: 'acd16c5f-7abe-4ce9-ac3b-a74804af1f58',
				is_verified: false,
				date_created: '2014-01-23T07:46:39',
				date_updated: '2027-02-05T03:43:59'
			}
			const dummy_req = {
				democracy_id: expected.democracy_id,
				profile_id: expected.profile_id
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [dummy_req],
				val: [],
				err: false
			},{
				fxn: 'returning',
				args: ['*'],
				val: [],
				err: false
			}])	
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { id: expected.democracy_id },
				err: false
			}], errors)

			// call handler
			await mem_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		// error: db insert error
		test('Error: DB insert error', async() => {

			// set up mocks
			let expected = {
				id: '3f8d3110-e63c-491f-a1d4-772ded682d8f',
				democracy_id: '9cc71698-5845-4186-8620-2efb1cecc964',
				profile_id: 'acd16c5f-7abe-4ce9-ac3b-a74804af1f58',
				is_verified: false,
				date_created: '2014-01-23T07:46:39',
				date_updated: '2027-02-05T03:43:59'
			}
			const dummy_req = {
				democracy_id: expected.democracy_id,
				profile_id: expected.profile_id
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: [dummy_req],
				val: [],
				err: false
			},{
				fxn: 'returning',
				args: ['*'],
				val: [],
				err: new Error(errors.internal_error)
			}])	
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { id: expected.democracy_id },
				err: false
			}], errors)

			// call handler
			await mem_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
	})

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()
		const profile_id = 'acd16c5f-7abe-4ce9-ac3b-a74804af1f58'

		// success
		test('Success', async () => {
			const mem = await mem_create_i(test_data['democracy']['root_child']['id'], profile_id)
			expect(mem.democracy_id).toBe(test_data['democracy']['root_child']['id'])
			expect(mem.profile_id).toBe(profile_id)
			expect(mem.is_verified).toBeFalsy()
			expect(mem.membership_id).toBeDefined()
			expect(mem.date_created).toBeDefined()
			expect(mem.date_updated).toBeNull()
		})

		// error: invalid democracy_id
		test('Error: invalid democracy id', async () => {
			await expect(mem_create_i('51a9a676-3b1e-47eb-845b-2784ccdd1d50', profile_id)).rejects
				.toThrow(new Error(errors.democracy_dne))
		})

		// error: pre-existing membership
		test('Error: pre-existing membership', async () => {
			await expect(mem_create_i(test_data['membership']['verified_root_1']['democracy_id'],
				test_data['membership']['verified_root_1']['profile_id'])).rejects
				.toThrow(new Error(errors.membership_exist))
		})	
	})	
})
