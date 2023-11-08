const api_proposal_client = new (require('@AluminumOxide/direct-democracy-proposal-api-client'))()

const test_data = require('./test.json')
let demid = test_data['democracy']['root_child']['id']
let memid = test_data['membership']['verified_child_1']['id']
let propid, bltid

describe('Proposal', () => {
	
	describe('List', () => {
		test('Success', async () => {
			const props = await api_proposal_client.proposal_list({
			})
			expect(true) // TODO
		})	
	})
	
	describe('Create', () => {
		test('Success', async () => {
			const prop = await api_proposal_client.proposal_create({
				democracy_id: demid,
				membership_id: memid,
				proposal_name: 'asdf',
				proposal_description: 'asdf',
				proposal_target: 'name',
				proposal_changes: {'_update':{'name':'qwer'}}
			})
			propid=prop['proposal_id']
			expect(true) // TODO 
		})
	})

	describe('Read', () => {
		test('Success', async () => {
			const prop = await api_proposal_client.proposal_read({
				proposal_id: propid
			})
			expect(true) // TODO 
		})
	})
	
	describe('Close', () => {
		test('Success', async () => {
			const prop = await api_proposal_client.proposal_close({
				passed: true,
				proposal_id: propid
			})
			expect(true) // TODO 
		})
	})

	describe('Delete', () => {
		test('Success', async () => {
			const prop = await api_proposal_client.proposal_delete({
				proposal_id: propid
			})
			expect(true) // TODO 
		})
	})
})

describe('Ballot', () => {
	
	describe('List', () => {
		test('Success', async () => {
			const blts = await api_proposal_client.ballot_list({
			})
			expect(true) // TODO
		})	
	})
	
	describe('Create', () => {
		test('Success', async () => {
			const blt = await api_proposal_client.ballot_create({
				proposal_id: test_data['proposal']['gchild_content_close']['id'],
				membership_id: memid,
				ballot_approved: true,
				ballot_comments: 'adsfasdf'
			})
			bltid=blt['ballot_id']
			expect(true) // TODO 
		})
	})

	describe('Read', () => {
		test('Success', async () => {
			const blt = await api_proposal_client.ballot_read({
				ballot_id: bltid
			})
			expect(true) // TODO 
		})
	})
	
	describe('Update', () => {
		test('Success', async () => {
			const blt = await api_proposal_client.ballot_update({
				ballot_id: bltid,
				proposal_id: test_data['proposal']['gchild_content_close']['id'],
				membership_id: memid,
				ballot_approved: false,
				ballot_comments: 'qwer'
			})
			expect(true) // TODO 
		})
	})

	describe('Delete', () => {
		test('Success', async () => {
			const blt = await api_proposal_client.ballot_delete({
				ballot_id: bltid,
				proposal_id: test_data['proposal']['gchild_content_close']['id']
			})
			expect(true) // TODO 
		})
	})
	
	describe('Verified', () => {
		test('Success', async () => {
			const blt = await api_proposal_client.ballot_verified({})
			expect(true) // TODO 
		})
	})
})
