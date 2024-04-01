const api_proposal_client = new (require('@AluminumOxide/direct-democracy-proposal-api-client'))()
const { reset_test_data } = require('../helper') 


describe('Create', () => {
	const test_data = reset_test_data()

	const prop_create = async ({ democracy_id, membership_id, proposal_name, proposal_description, proposal_target, proposal_changes }) => {
		return await api_proposal_client.proposal_create({
			democracy_id,
			membership_id,
			proposal_name,
			proposal_description,
			proposal_target,
			proposal_changes
		})
	}

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
		await expect(prop_create(test_prop)).resolves.toMatchObject(test_prop)
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
		await expect(prop_create(test_prop)).resolves.toMatchObject(test_prop)
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
		await expect(prop_create(test_prop)).resolves.toMatchObject(test_prop)
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
		await expect(prop_create(test_prop)).resolves.toMatchObject(test_prop)
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
		await expect(prop_create(test_prop)).resolves.toMatchObject(test_prop)
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
		await expect(prop_create(test_prop)).rejects.toThrow(Error) // TODO: real error
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
		await expect(prop_create(test_prop)).rejects.toThrow(Error) // TODO: real error
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
		await expect(prop_create(test_prop)).rejects.toThrow(Error) // TODO: real error
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
		await expect(prop_create(test_prop)).rejects.toThrow(Error) // TODO: real error
	})

	// TODO: more forms of invalid changes
})
