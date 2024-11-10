const {
	errors,
	get_dummy_api,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	proposal_create_unit: prop_create_u,
	reset_test_data,
	proposal_create_integration: prop_create_i
} = require('../helper') 
const json_changes = require('@aluminumoxide/direct-democracy-lib-json-changes')

describe('Proposal Create', () => {

	describe('Unit Tests', () => { 

		// success
		test('Success', async() => {

			// set up mocks
			
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'target',
				proposal_changes: {},
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000'
			}
			let expected = {
				id: '00000000-0000-0000-0000-000000000000',
				democracy_id: dummy_req.democracy_id,
				membership_id: dummy_req.membership_id,
				name: dummy_req.proposal_name,
				description: dummy_req.proposal_description,
				target: dummy_req.proposal_target,
				changes: dummy_req.proposal_changes,
				votable: true,
				date_created: '2100-01-01T00:00:00',
				date_updated: '2100-01-01T00:00:00'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				last_val: [expected]
			}])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id },
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read',
				val: { 'democracy_target':{} },
				err: false
			}])
			json_changes.check_changes = jest.fn().mockReturnValue(true)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expected.proposal_id = expected.id
			expected.proposal_name = expected.name
			expected.proposal_description = expected.description
			expected.proposal_target = expected.target
			expected.proposal_changes = expected.changes
			expected.proposal_votable = expected.votable
			delete expected.id
			delete expected.name
			delete expected.description
			delete expected.target
			delete expected.changes
			delete expected.votable
			expect(dummy_reply.code).toBeCalledWith(201)
			expect(dummy_reply.send).toBeCalledWith(expected)

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: invalid democracy for membership
		test('Error: Invalid democracy for membership', async() => {

			// set up mocks		
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'target',
				proposal_changes: {},
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: { democracy_id: 'nottheid' },
				err: false
			}])

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.democracy_invalid))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: invalid membership
		test('Error: Invalid democracy', async() => {

			// set up mocks		
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'target',
				proposal_changes: {},
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: new Error(errors.membership_dne),
				err: true
			}])

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.membership_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: membership lookup failure
		test('Error: Membership lookup failure', async() => {

			// set up mocks		
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'target',
				proposal_changes: {},
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: new Error(errors.internal_error),
				err: true
			}])

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		// error: invalid democracy
		test('Error: Invalid democracy', async() => {

			// set up mocks		
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'target',
				proposal_changes: {},
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id },
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read',
				val: new Error(errors.democracy_dne),
				err: true
			}])

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.democracy_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		// error: democracy lookup failure
		test('Error: Democracy lookup failure', async() => {

			// set up mocks		
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'target',
				proposal_changes: {},
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id },
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read',
				val: new Error(errors.internal_error),
				err: true
			}])

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
			
		// error: invalid changes
		test('Error: Invalid changes', async() => {

			// set up mocks		
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'target',
				proposal_changes: {},
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id },
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read',
				val: { 'democracy_target':{} },
				err: false
			}])
			json_changes.check_changes = jest.fn().mockReturnValue(false)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.changes_invalid))
			expect(dummy_reply.code).toBeCalledWith(400)


			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: db insert failure
		test('Error: DB insert failure', async() => {

			// set up mocks		
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'target',
				proposal_changes: {},
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				last_val: [],
				throws_error: false
			}])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id },
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read',
				val: { 'democracy_target':{} },
				err: false
			}])
			json_changes.check_changes = jest.fn().mockReturnValue(true)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		// error: db insert error
		test('Error: DB insert error', async() => {

			// set up mocks		
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'target',
				proposal_changes: {},
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				last_val: [],
				throws_error: true
			}])
			get_dummy_api('membership', [{
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id },
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read',
				val: { 'democracy_target':{} },
				err: false
			}])
			json_changes.check_changes = jest.fn().mockReturnValue(true)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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

		const test_data = reset_test_data()
	
		// success: name update
		test('Success: Name update', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'name',
				proposal_changes: {'_update':{'name':'qwer'}}
			}
			await expect(prop_create_i(test_prop)).resolves.toMatchObject(test_prop)
		})
		
		// success: description update
		test('Success: Description update', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'description',
				proposal_changes: {'_update':{'name':'qwer'}}
			}
			await expect(prop_create_i(test_prop)).resolves.toMatchObject(test_prop)
		})
	
		// success: conduct add
		test('Success: Conduct add', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'conduct',
				proposal_changes: {'_add':{'test':'testtesttest'}}
			}
			await expect(prop_create_i(test_prop)).resolves.toMatchObject(test_prop)
		})
		
		// success: content delete
		test('Success: Content delete', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'content',
				proposal_changes: {'_delete':['c']}
			}
			await expect(prop_create_i(test_prop)).resolves.toMatchObject(test_prop)
		})
	
		// success: metas multi
		test('Success: Metas multi', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'metas',
				proposal_changes: {
					'name':{ 'update':{ 
						'_add':{ 'approval_number_minimum': 3 }, 
						'_delete':['approval_percent_minimum']}},
					 'description': { 'update':{ 
						 '_update':{ 'approval_percent_minimum': 80}}}
				}
			}
			await expect(prop_create_i(test_prop)).resolves.toMatchObject(test_prop)
		})
	
		// error: invalid membership id
		test('Error: Invalid membership_id', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['democracy']['root_child']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'name',
				proposal_changes: {'_update':{'name':'qwer'}}
			}
			await expect(prop_create_i(test_prop)).rejects.toThrow(new Error(errors.membership_dne))
		})
	
		// error: invalid democracy id
		test('Error: Invalid democracy_id', async () => {
			const test_prop = {
				democracy_id: test_data['membership']['verified_child_1']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'name',
				proposal_changes: {'_update':{'name':'qwer'}}
			}
			await expect(prop_create_i(test_prop)).rejects.toThrow(new Error(errors.democracy_invalid))
		})
	
		// error: invalid target	
		test('Error: Invalid target', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'asdf',
				proposal_changes: {'_update':{'name':'qwer'}}
			}
			await expect(prop_create_i(test_prop)).rejects.toThrow(new Error(errors.changes_invalid))
		})
	
		// error: invalid changes 
		test('Error: Invalid changes', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'name',
				proposal_changes: {'_add':{'name':'qwer'}}
			}
			await expect(prop_create_i(test_prop)).rejects.toThrow(new Error(errors.changes_invalid))
		})
	
		// TODO: more forms of invalid changes
	})
})
