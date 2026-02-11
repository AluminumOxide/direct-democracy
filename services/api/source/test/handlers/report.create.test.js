const {
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_lib,
	integration_test_setup,
	report_create_unit: report_u,
	report_create_integration: report_i
} = require('../helper')

describe('Report Create', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success: Ballot comments', async() => {
			const dem = test_data.democracy.root
			const pro = test_data.profile.profile
			const trg = test_data.ballot.rcf_dv_2
			const cmt = 'User provided'
			const mid = 'Nothing illegal'
			const rpt = await report_i(dem.id, mid, cmt, 'ballot', trg.id, 'comments', [], pro.id, pro.auth_token, pro.auth_expiry)
			expect(rpt.democracy_id).toBe(dem.id)
			expect(rpt.proposal_target).toBe('democracy_misconduct')
			expect(rpt.proposal_name).toBe(mid)
			expect(rpt.proposal_description).toBe(cmt)
			expect(rpt.proposal_changes).toMatchObject({[mid]:{'ballot':{[trg.id]:{'_add':{'comments':[]}}}}})
		})

		test('Success: Proposal name, own rules', async() => {
			const dem = test_data.democracy.root
			const pro = test_data.profile.profile
			const trg = test_data.proposal.root_conduct_fail
			const cmt = 'User provided'
			const mid = 'Nothing illegal'
			const rpt = await report_i(dem.id, mid, cmt, 'proposal', trg.id, 'name', [], pro.id, pro.auth_token, pro.auth_expiry)
			expect(rpt.democracy_id).toBe(dem.id)
			expect(rpt.proposal_target).toBe('democracy_misconduct')
			expect(rpt.proposal_name).toBe(mid)
			expect(rpt.proposal_description).toBe(cmt)
			expect(rpt.proposal_changes).toMatchObject({[mid]:{'proposal':{[trg.id]:{'_add':{'name':[]}}}}})
		})

		test('Success: Proposal description, grandparent rules', async() => {
			const dem = test_data.democracy.root
			const pro = test_data.profile.profile
			const trg = test_data.proposal.gchild_content_close
			const cmt = 'User provided'
			const mid = 'Nothing illegal'
			const rpt = await report_i(dem.id, mid, cmt, 'proposal', trg.id, 'description', [], pro.id, pro.auth_token, pro.auth_expiry)
			expect(rpt.democracy_id).toBe(dem.id)
			expect(rpt.proposal_target).toBe('democracy_misconduct')
			expect(rpt.proposal_name).toBe(mid)
			expect(rpt.proposal_description).toBe(cmt)
			expect(rpt.proposal_changes).toMatchObject({[mid]:{'proposal':{[trg.id]:{'_add':{'description':[]}}}}})
		})

		test('Success: Proposal changes, parent rules', async() => {
			const dem = test_data.democracy.root
			const pro = test_data.profile.profile
			const trg = test_data.proposal.child_metas_pass
			const cmt = 'User provided'
			const mid = 'Nothing illegal'
			const rpt = await report_i(dem.id, mid, cmt, 'proposal', trg.id, 'changes', ['democracy_name','update','_add','approval_number_minimum'], pro.id, pro.auth_token, pro.auth_expiry)
			expect(rpt.democracy_id).toBe(dem.id)
			expect(rpt.proposal_target).toBe('democracy_misconduct')
			expect(rpt.proposal_name).toBe(mid)
			expect(rpt.proposal_description).toBe(cmt)
			expect(rpt.proposal_changes).toMatchObject({[mid]:{'proposal':{[trg.id]:{'_add':{'changes':['democracy_name','update','_add','approval_number_minimum']}}}}})
		})

		test('Success: Democracy name, own rules', async() => {
			const dem = test_data.democracy.root_child
			const pro = test_data.profile.profile
			const trg = dem
			const cmt = 'User provided'
			const mid = 'Be cool'
			const rpt = await report_i(dem.id, mid, cmt, 'democracy', trg.id, 'name', [], pro.id, pro.auth_token, pro.auth_expiry)
			expect(rpt.democracy_id).toBe(dem.id)
			expect(rpt.proposal_target).toBe('democracy_misconduct')
			expect(rpt.proposal_name).toBe(mid)
			expect(rpt.proposal_description).toBe(cmt)
			expect(rpt.proposal_changes).toMatchObject({[mid]:{'democracy':{[trg.id]:{'_add':{'name':[]}}}}})
		})

		test('Success: Democracy description, grandparent rules', async() => {
			const dem = test_data.democracy.root
			const pro = test_data.profile.profile
			const trg = test_data.democracy.not_root_child
			const cmt = 'User provided'
			const mid = 'Nothing illegal'
			const rpt = await report_i(dem.id, mid, cmt, 'democracy', trg.id, 'description', [], pro.id, pro.auth_token, pro.auth_expiry)
			expect(rpt.democracy_id).toBe(dem.id)
			expect(rpt.proposal_target).toBe('democracy_misconduct')
			expect(rpt.proposal_name).toBe(mid)
			expect(rpt.proposal_description).toBe(cmt)
			expect(rpt.proposal_changes).toMatchObject({[mid]:{'democracy':{[trg.id]:{'_add':{'description':[]}}}}})
		})

		test('Success: Democracy conduct, parent rules', async() => {
			const dem = test_data.democracy.root
			const pro = test_data.profile.profile
			const trg = test_data.democracy.root_child
			const cmt = 'User provided'
			const mid = 'Nothing illegal'
			const rpt = await report_i(dem.id, mid, cmt, 'democracy', trg.id, 'conduct', ['Be cool'], pro.id, pro.auth_token, pro.auth_expiry)
			expect(rpt.democracy_id).toBe(dem.id)
			expect(rpt.proposal_target).toBe('democracy_misconduct')
			expect(rpt.proposal_name).toBe(mid)
			expect(rpt.proposal_description).toBe(cmt)
			expect(rpt.proposal_changes).toMatchObject({[mid]:{'democracy':{[trg.id]:{'_add':{'conduct':['Be cool']}}}}})
		})

		test('Success: Democracy content, parent rules', async() => {
			const dem = test_data.democracy.root
			const pro = test_data.profile.profile
			const trg = test_data.democracy.root_child
			const cmt = 'User provided'
			const mid = 'Nothing illegal'
			const rpt = await report_i(dem.id, mid, cmt, 'democracy', trg.id, 'content', ['a'], pro.id, pro.auth_token, pro.auth_expiry)
			expect(rpt.democracy_id).toBe(dem.id)
			expect(rpt.proposal_target).toBe('democracy_misconduct')
			expect(rpt.proposal_name).toBe(mid)
			expect(rpt.proposal_description).toBe(cmt)
			expect(rpt.proposal_changes).toMatchObject({[mid]:{'democracy':{[trg.id]:{'_add':{'content':['a']}}}}})
		})

		test('Error: Invalid democracy', async() => {
			const dem = get_uuid()
			const pro = test_data.profile.profile
			const trg = test_data.ballot.rcf_dv_2.id
			const mid = 'Nothing illegal'
			await expect(report_i(dem, mid, 'test', 'ballot', trg, 'comments', [], pro.id, pro.auth_token, pro.auth_expiry)).rejects.toThrow(new Error(errors.invalid_auth))
		})

		test('Error: Invalid misconduct', async() => {
			const dem = test_data.democracy.root_child.id
			const pro = test_data.profile.profile
			const trg = test_data.ballot.rcf_dv_2.id
			const mid = 'bad'
			await expect(report_i(dem, mid, 'test', 'ballot', trg, 'comments', [], pro.id, pro.auth_token, pro.auth_expiry)).rejects.toThrow(new Error(errors.changes_invalid))
		})

		test('Error: Invalid target', async() => {
			const dem = test_data.democracy.root_child.id
			const pro = test_data.profile.profile
			const trg = test_data.ballot.rcf_dv_2.id
			const mid = 'Nothing illegal'
			await expect(report_i(dem, mid, 'test', 'bad', trg, 'comments', [], pro.id, pro.auth_token, pro.auth_expiry)).rejects.toThrow(new Error(errors.changes_invalid))
		})

		test('Error: Invalid text', async() => {
			const dem = test_data.democracy.root_child.id
			const pro = test_data.profile.profile
			const trg = test_data.ballot.rcf_dv_2.id
			const mid = 'Nothing illegal'
			await expect(report_i(dem, mid, 'test', 'ballot', trg, 'bad', [], pro.id, pro.auth_token, pro.auth_expiry)).rejects.toThrow(new Error(errors.changes_invalid))
		})

		test('Error: Invalid keys', async() => {
			const dem = test_data.democracy.root_child.id
			const pro = test_data.profile.profile
			const trg = test_data.proposal.child_metas_pass.id
			const mid = 'Nothing illegal'
			await expect(report_i(dem, mid, 'test', 'proposal', trg, 'changes', ['bad'], pro.id, pro.auth_token, pro.auth_expiry)).rejects.toThrow(new Error(errors.changes_invalid))
		})
	})

	describe('Unit Tests', () => {

		const profile_id = get_uuid()
		const jwt = JSON.stringify({ profile_id })

		test('Success', async() => {

			// set up mocks
			const id = get_uuid()
			const dummy_req = {
				democracy_id: get_uuid(),
				misconduct_id: 'Rule Name',
				misconduct_description: 'User text',
				target_type: 'ballot',
				target_id: get_uuid(),
				target_text: 'comments',
				target_keys: [],
				jwt
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				err: false,
				val: {profile_id: get_uuid()}
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				err: false,
				val: [{membership_id: get_uuid()}]
			},{
				lib: 'api_proposal',
				fxn: 'proposal_create',
				err: false,
				val: {}
			}], errors)
			
			// call handler
			await report_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(201)
			expect(dummy_reply.send).toHaveBeenCalledWith({})

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid JWT', async() => {

			// set up mocks
			const id = get_uuid()
			const dummy_req = {
				democracy_id: get_uuid(),
				misconduct_id: 'Rule Name',
				misconduct_description: 'User text',
				target_type: 'ballot',
				target_id: get_uuid(),
				target_text: 'comments',
				target_keys: [],
				jwt
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				err: true,
				val: errors.invalid_auth
			}], errors)
			
			// call handler
			await report_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(401)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid Profile', async() => {

			// set up mocks
			const id = get_uuid()
			const dummy_req = {
				democracy_id: get_uuid(),
				misconduct_id: 'Rule Name',
				misconduct_description: 'User text',
				target_type: 'ballot',
				target_id: get_uuid(),
				target_text: 'comments',
				target_keys: [],
				jwt
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				err: false,
				val: {}
			}], errors)
			
			// call handler
			await report_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(401)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		test('Error: Invalid Membership', async() => {

			// set up mocks
			const id = get_uuid()
			const dummy_req = {
				democracy_id: get_uuid(),
				misconduct_id: 'Rule Name',
				misconduct_description: 'User text',
				target_type: 'ballot',
				target_id: get_uuid(),
				target_text: 'comments',
				target_keys: [],
				jwt
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				err: false,
				val: {profile_id}
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				err: false,
				val: []
			}], errors)
			
			// call handler
			await report_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(401)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.invalid_auth))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Duplicate Membership', async() => {

			// set up mocks
			const id = get_uuid()
			const dummy_req = {
				democracy_id: get_uuid(),
				misconduct_id: 'Rule Name',
				misconduct_description: 'User text',
				target_type: 'ballot',
				target_id: get_uuid(),
				target_text: 'comments',
				target_keys: [],
				jwt
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				err: false,
				val: {profile_id}
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				err: false,
				val: [{},{}]
			}], errors)
			
			// call handler
			await report_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})

		test('Error: Invalid Democracy', async() => {

			// set up mocks
			const id = get_uuid()
			const dummy_req = {
				democracy_id: get_uuid(),
				misconduct_id: 'Rule Name',
				misconduct_description: 'User text',
				target_type: 'ballot',
				target_id: get_uuid(),
				target_text: 'comments',
				target_keys: [],
				jwt
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				err: false,
				val: {profile_id}
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				err: false,
				val: [{membership_id: get_uuid()}]
			},{
				lib: 'api_proposal',
				fxn: 'proposal_create',
				err: true,
				val: errors.democracy_invalid
			}], errors)
			
			// call handler
			await report_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.democracy_invalid))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Invalid Changes', async() => {

			// set up mocks
			const id = get_uuid()
			const dummy_req = {
				democracy_id: get_uuid(),
				misconduct_id: 'Rule Name',
				misconduct_description: 'User text',
				target_type: 'ballot',
				target_id: get_uuid(),
				target_text: 'comments',
				target_keys: [],
				jwt
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				err: false,
				val: {profile_id}
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				err: false,
				val: [{membership_id: get_uuid()}]
			},{
				lib: 'api_proposal',
				fxn: 'proposal_create',
				err: true,
				val: errors.changes_invalid
			}], errors)
			
			// call handler
			await report_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.changes_invalid))

			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: Proposal Failure', async() => {

			// set up mocks
			const id = get_uuid()
			const dummy_req = {
				democracy_id: get_uuid(),
				misconduct_id: 'Rule Name',
				misconduct_description: 'User text',
				target_type: 'ballot',
				target_id: get_uuid(),
				target_text: 'comments',
				target_keys: [],
				jwt
			}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_profile',
				fxn: 'sign_in_verify',
				err: false,
				val: {profile_id}
			},{
				lib: 'api_membership',
				fxn: 'membership_list',
				err: false,
				val: [{membership_id: get_uuid()}]
			},{
				lib: 'api_proposal',
				fxn: 'proposal_create',
				err: true,
				val: errors.internal_error
			}], errors)
			
			// call handler
			await report_u(dummy_req, dummy_reply, {}, dummy_log, dummy_lib)

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
