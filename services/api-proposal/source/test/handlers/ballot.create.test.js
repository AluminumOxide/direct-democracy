const api_proposal_client = require('@AluminumOxide/direct-democracy-proposal-api-client')
const { reset_test_data } = require('../helper') 
	
describe('Create', () => {
	const test_data = reset_test_data()
	const blt_create = async ({proposal_id, membership_id, ballot_approved, ballot_comments}) => {
		return await api_proposal_client.ballot_create({
			proposal_id,
			membership_id,
			ballot_approved,
			ballot_comments
		})
	}

	// success
	test('Success', async () => {
		const test_blt = {
			membership_id: test_data['membership']['unverified_child_4']['id'],
			proposal_id: test_data['proposal']['child_metas_pass']['id'],
			ballot_approved: true,
			ballot_comments: 'asdfasdf'
		}
		await expect(blt_create(test_blt)).resolves.toMatchObject(test_blt)
	})

	// error: invalid proposal id
	test('Error: Invalid proposal id', async () => {
		const test_blt = {
			membership_id: test_data['membership']['unverified_child_4']['id'],
			proposal_id: test_data['membership']['unverified_child_4']['id'],
			ballot_approved: true,
			ballot_comments: 'asdfasdf'
		}
		await expect(blt_create(test_blt)).rejects.toThrow(Error) // TODO: real error
	})

	// error: invalid membership id
	test('Error: Invalid membership id', async () => {
		const test_blt = {
			membership_id: test_data['proposal']['child_metas_pass']['id'],
			proposal_id: test_data['proposal']['child_metas_pass']['id'],
			ballot_approved: true,
			ballot_comments: 'asdfasdf'
		}
		await expect(blt_create(test_blt)).rejects.toThrow(Error) // TODO: real error
	})

	// error: invalid ballot approved
	test('Error: Invalid ballot approved', async () => {
		const test_blt = {
			membership_id: test_data['membership']['unverified_child_4']['id'],
			proposal_id: test_data['proposal']['child_metas_pass']['id'],
			ballot_approved: 'bad',
			ballot_comments: 'asdfasdf'
		}
		await expect(blt_create(test_blt)).rejects.toThrow(Error) // TODO: real error
	})
})
