const {
	errors,
	get_dummy_lib,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	proposal_create_unit: prop_create_u,
	integration_test_setup,
	proposal_create_integration: prop_create_i,
	membership_read_integration: mem_read_i
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:true },
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			expect(dummy_reply.code).toHaveBeenCalledWith(201)
			expect(dummy_reply.send).toHaveBeenCalledWith(expected)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Success: Verify Membership', async() => {

			// set up mocks
			
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'democracy_members',
				proposal_changes: {'00000000-0000-0000-0000-000000000000':{_update:{is_verified:true}}},
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			expect(dummy_reply.code).toHaveBeenCalledWith(201)
			expect(dummy_reply.send).toHaveBeenCalledWith(expected)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Success: Misconduct', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{ballot:{tid:{_add:{comments:[]}}}}},
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
				fxn: 'where',
				args: [{id: 'tid'}],
				val: [{}],
				call: 1
			},{
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_conduct':{'rule':{}}, 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			expect(dummy_reply.code).toHaveBeenCalledWith(201)
			expect(dummy_reply.send).toHaveBeenCalledWith(expected)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Success: Misconduct Proposal', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{proposal:{tid:{_add:{name:[]}}}}},
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_conduct':{'rule':{}}, 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: {proposal_name:'test'},
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
			expect(dummy_reply.code).toHaveBeenCalledWith(201)
			expect(dummy_reply.send).toHaveBeenCalledWith(expected)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Invalid misconduct rule', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{ballot:{tid:{_add:{comments:[]}}}}},
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
				fxn: 'where',
				args: [{id: 'tid'}],
				val: [{}],
				call: 1
			},{
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_conduct':{}, 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid Misconduct Democracy Conduct', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{democracy:{tid:{_add:{conduct:['bad']}}}}},
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_conduct':{'rule':{}}, 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false,
			},{
				lib: 'lib_json',
				fxn: 'obj_get',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid Misconduct Democracy Content', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{democracy:{tid:{_add:{content:['bad']}}}}},
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_conduct':{'rule':{}}, 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false,
				call: 1
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: false,
				err: false,
				call: 2
			},{
				lib: 'lib_json',
				fxn: 'obj_get',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid Misconduct Democracy Conduct', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{democracy:{tid:{_add:{content:['bad']}}}}},
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_conduct':{'rule':{}}, 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'obj_get',
				val: false,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid misconduct type/text', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{bad:{tid:{_add:{bad:[]}}}}},
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_conduct':{'rule':{}}, 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'obj_get',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid Misconduct Ballot', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{ballot:{tid:{_add:{comments:[]}}}}},
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
				fxn: 'where',
				args: [{id: 'tid'}],
				val: [],
				call: 1
			},{
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_conduct':{'rule':{}}, 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Invalid Misconduct Proposal', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{proposal:{tid:{_add:{name:[]}}}}},
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_conduct':{'rule':{}}, 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: false,
				err: false
			},{
				lib: 'lib_json',
				fxn: 'obj_get',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid Misconduct Proposal Changes', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{proposal:{tid:{_add:{changes:['bad']}}}}},
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_conduct':{'rule':{}}, 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'api_proposal',
				fxn: 'proposal_read',
				val: { proposal_changes:{}},
				err: false
			},{
				lib: 'lib_json',
				fxn: 'obj_get',
				val: false,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		// misconduct
		test('Error: Invalid Misconduct Rule', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rulezzz',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{ttype:{tid:{_add:{ttext:[]}}}}},
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{} },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply

			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Invalid Misconduct Type', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{_add:{'bad':'bad'}}},
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply

			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid Misconduct ID', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{ttype:{_add:{'bad':'bad'}}}},
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply

			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Invalid Misconduct Text', async() => {

			// set up mocks	
			const dummy_req = {
				proposal_name: 'rule',
				proposal_description: 'test test test',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {rule:{ttype:{_add:{'bad':'bad'}}}},
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
				fxn: 'returning',
				args: ['*'],
				val: [expected]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:false },
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: '',
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply

			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
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
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: 'nottheid', is_verified:true  },
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.democracy_invalid))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Unverified membership', async() => {

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
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified: false },
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_unverified))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
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
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: errors.membership_dne,
				err: true
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.membership_dne))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
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
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: errors.internal_error,
				err: true
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
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
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:true  },
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: errors.democracy_dne,
				err: true
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.democracy_dne))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
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
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id , is_verified:true },
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: errors.internal_error,
				err: true
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
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
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:true  },
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{}, 'democracy_children':[]  },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: false,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Non-unique changes', async() => {

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
				fxn: 'where',
				val: [{
					id: '00000000-0000-0000-0000-000000000000',
					democracy_id: '00000000-0000-0000-0000-000000000000',
					membership_id: '00000000-0000-0000-0000-000000000000',
					name: 'test',
					description: 'test',
					target: 'target',
					changes: {},
					votable: true,
					date_created: '',
					date_updated: '',
				}]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:true  },
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{}, 'democracy_children':[]  },
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith({
				proposal_id: '00000000-0000-0000-0000-000000000000',
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000',
				proposal_name: 'test',
				proposal_description: 'test',
				proposal_target: 'target',
				proposal_changes: {},
				proposal_votable: true,
				date_created: '',
				date_updated: '',
			})
			expect(dummy_reply.code).toHaveBeenCalledWith(200)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid membership verification', async() => {

			// set up mocks		
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'democracy_members',
				proposal_changes: {},
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:true  },
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{}, 'democracy_children':[]  },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: false,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
	
		test('Error: Membership verification error', async() => {

			// set up mocks		
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'democracy_members',
				proposal_changes: {'00000000-0000-0000-0000-000000000000':{_update:{is_verified:true}}},
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([{
				fxn: 'returning',
				args: ['*'],
				val: [dummy_req]
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified: false },
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{}, 'democracy_children':[{id:'00000000-0000-0000-0000-000000000000',name:'test'}] },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			},{
				lib: 'api_membership',
				fxn: 'membership_verifying',
				val: errors.internal_error,
				err: true
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			expect(dummy_reply.code).toHaveBeenCalledWith(500)


			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		test('Error: Invalid error changes', async() => {

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
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:true  },
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{}, 'democracy_children':[]  },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: false,
				err: true
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid child democracy', async() => {

			// set up mocks		
			const dummy_req = {
				proposal_name: 'test',
				proposal_description: 'test test test',
				proposal_target: 'democracy_children',
				proposal_changes: {_add:{test:{
					democracy_content:{},
					democracy_conduct:{}
				}}},
				democracy_id: '00000000-0000-0000-0000-000000000000',
				membership_id: '00000000-0000-0000-0000-000000000000'
			}
			const dummy_reply = get_dummy_reply()
			const dummy_log = get_dummy_log()
			const dummy_db = get_dummy_db([])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:true  },
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_children':[]  },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))
			expect(dummy_reply.code).toHaveBeenCalledWith(400)

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
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
				fxn: 'returning',
				args: ['*'],
				val: [],
				err: false
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:true  },
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{}, 'democracy_children':[]  },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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
				fxn: 'returning',
				args: ['*'],
				val: [],
				err: true
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_read',
				val: { democracy_id: dummy_req.democracy_id, is_verified:true  },
				err: false
			},{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				val: { 'democracy_target':{}, 'democracy_children':[]  },
				err: false
			},{
				lib: 'lib_json',
				fxn: 'check_changes',
				val: true,
				err: false
			}], errors)

			// call handler
			await prop_create_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

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

		// success: name update
		test('Success: Name update', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'democracy_name',
				proposal_changes: {'_update':{'democracy_name':'qwer'}}
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
				proposal_target: 'democracy_description',
				proposal_changes: {'_update':{'democracy_description':'qwer'}}
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
				proposal_target: 'democracy_conduct',
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
				proposal_target: 'democracy_content',
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
				proposal_target: 'democracy_metas',
				proposal_changes: {
					'democracy_name':{ 'update':{ 
						'_add':{ 'approval_number_minimum': 3 }, 
						'_delete':['approval_percent_minimum']}},
					 'democracy_description': { 'update':{ 
						 '_update':{ 'approval_percent_minimum': 80}}}
				}
			}
			await expect(prop_create_i(test_prop)).resolves.toMatchObject(test_prop)
		})
		
		// success: create democracy
		test('Success: Add child democracy', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'New Democracy',
				proposal_description: 'Democracy Desc',
				proposal_target: 'democracy_children',
				proposal_changes: {'_add':{'New Democracy':{
					democracy_conduct:{},
					democracy_content:{},
					democracy_metas: test_data['democracy']['root_child']['democracy_metas'] }}}
			}
			await expect(prop_create_i(test_prop)).resolves.toMatchObject(test_prop)
		})
		
		// success: verify membership
		test('Success: Membership verify', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['unverified_child_1']['id'],
				proposal_name: 'Membership Verification Request',
				proposal_description: 'Text entered by user wanting verification',
				proposal_target: 'democracy_members',
				proposal_changes: {[test_data['membership']['unverified_child_1']['id']]:{_update:{is_verified:true}}}
			}
			const new_prop = await prop_create_i(test_prop)
			expect(new_prop).toMatchObject(test_prop)
			const test_mem = await mem_read_i(test_prop.membership_id)
			expect(!!test_mem.is_verifying)
			expect(test_mem.verify_proposal).toBe(new_prop.proposal_id)
		})

		// success: misconduct
		test('Success: Misconduct - Democracy name, own rule', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'Be cool',
				proposal_description: 'Text entered by user claiming misconduct',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {'Be cool':{'democracy':{[test_data['democracy']['root_child']['id']]:{'_add':{'name':[]}}}}}
			}
			const new_prop = await prop_create_i(test_prop)
			expect(new_prop).toMatchObject(test_prop)
		})
		test('Success: Misconduct - Democracy description, parent rule', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root']['id'],
				membership_id: test_data['membership']['verified_root_1']['id'],
				proposal_name: 'Nothing illegal',
				proposal_description: 'Text entered by user claiming misconduct',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {'Nothing illegal':{'democracy':{[test_data['democracy']['root_child']['id']]:{'_add':{'description':[]}}}}}
			}
			const new_prop = await prop_create_i(test_prop)
			expect(new_prop).toMatchObject(test_prop)
		})
		test('Success: Misconduct - Democracy content, grandparent rule', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root']['id'],
				membership_id: test_data['membership']['verified_root_1']['id'],
				proposal_name: 'Nothing illegal',
				proposal_description: 'Text entered by user claiming misconduct',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {'Nothing illegal':{'democracy':{[test_data['democracy']['not_root_child']['id']]:{'_add':{'content':['e']}}}}}
			}
			const new_prop = await prop_create_i(test_prop)
			expect(new_prop).toMatchObject(test_prop)
		})
		test('Success: Misconduct - Democracy conduct, parent rule', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root']['id'],
				membership_id: test_data['membership']['verified_root_1']['id'],
				proposal_name: 'Nothing illegal',
				proposal_description: 'Text entered by user claiming misconduct',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {'Nothing illegal':{'democracy':{[test_data['democracy']['root_child']['id']]:{'_add':{'conduct':['Be cool']}}}}}
			}
			const new_prop = await prop_create_i(test_prop)
			expect(new_prop).toMatchObject(test_prop)
		})
		test('Success: Misconduct - Proposal name, own rule', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'Be cool',
				proposal_description: 'Text entered by user claiming misconduct',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {'Be cool':{'proposal':{[test_data['proposal']['child_metas_pass']['id']]:{'_add':{'name':[]}}}}}
			}
			const new_prop = await prop_create_i(test_prop)
			expect(new_prop).toMatchObject(test_prop)
		})
		test('Success: Misconduct - Proposal description, parent rule', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root']['id'],
				membership_id: test_data['membership']['verified_root_1']['id'],
				proposal_name: 'No nazis',
				proposal_description: 'Text entered by user claiming misconduct',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {'No nazis':{'proposal':{[test_data['proposal']['child_metas_pass']['id']]:{'_add':{'description':[]}}}}}
			}
			const new_prop = await prop_create_i(test_prop)
			expect(new_prop).toMatchObject(test_prop)
		})
		test('Success: Misconduct - Proposal changes, grandparent rule', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root']['id'],
				membership_id: test_data['membership']['verified_root_1']['id'],
				proposal_name: 'No nazis',
				proposal_description: 'Text entered by user claiming misconduct',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {'No nazis':{'proposal':{[test_data['proposal']['gchild_content_close']['id']]:{'_add':{'changes':['_add']}}}}}
			}
			const new_prop = await prop_create_i(test_prop)
			expect(new_prop).toMatchObject(test_prop)
		})
		test('Success: Misconduct - Ballot comments, own rule', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'Be cool',
				proposal_description: 'Text entered by user claiming misconduct',
				proposal_target: 'democracy_misconduct',
				proposal_changes: {'Be cool':{'ballot':{[test_data['ballot']['cmp_av_5']['id']]:{'_add':{'comments':[]}}}}}
			}
			const new_prop = await prop_create_i(test_prop)
			expect(new_prop).toMatchObject(test_prop)
		})

		// error: non-unique proposal 
		test('Error: Non-unique changes', async () => {
			const test_prop = {
				democracy_id: test_data.democracy.root_child.id,
				membership_id: test_data.membership.verified_child_1.id,
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: test_data.proposal.child_metas_pass.target,
				proposal_changes: test_data.proposal.child_metas_pass.changes
			}
			let prop = await prop_create_i(test_prop)
			expect(prop).toMatchObject({
				democracy_id: test_data.proposal.child_metas_pass.democracy_id,
				membership_id: test_data.proposal.child_metas_pass.membership_id,
				proposal_name: test_data.proposal.child_metas_pass.name,
				proposal_description: test_data.proposal.child_metas_pass.description,
				proposal_target: test_data.proposal.child_metas_pass.target,
				proposal_changes: test_data.proposal.child_metas_pass.changes
			})
		})
	
		// error: invalid membership id
		test('Error: Invalid membership_id', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['democracy']['root_child']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'democracy_name',
				proposal_changes: {'_update':{'democracy_name':'qwer'}}
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
				proposal_target: 'democracy_name',
				proposal_changes: {'_update':{'democracy_name':'qwer'}}
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
				proposal_target: 'democracy_asdf',
				proposal_changes: {'_update':{'democracy_name':'qwer'}}
			}
			await expect(prop_create_i(test_prop)).rejects.toThrow(Error)
		})
	
		// error: invalid changes 
		test('Error: Invalid changes', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'democracy_name',
				proposal_changes: {'_add':{'democracy_name':'qwer'}}
			}
			await expect(prop_create_i(test_prop)).rejects.toThrow(new Error(errors.changes_invalid))
		})
		
		// error: invalid child democracy
		test('Error: Invalid child democracy', async () => {
			const test_prop = {
				democracy_id: test_data['democracy']['root_child']['id'],
				membership_id: test_data['membership']['verified_child_1']['id'],
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'democracy_children',
				proposal_changes: {'_add':{[test_data['democracy']['not_root_child']['democracy_name']]:{
					democracy_conduct:{},
					democracy_content:{},
					democracy_metas: test_data['democracy']['root_child']['democracy_metas'] }}}
			}
			await expect(prop_create_i(test_prop)).rejects.toThrow(new Error(errors.changes_invalid))
		})
	
		// TODO: more forms of invalid changes
	})
})
