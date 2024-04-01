const api_proposal_client = new (require('@AluminumOxide/direct-democracy-proposal-api-client'))()
const { reset_test_data } = require('../helper') 
	
describe('Update', () => {
	const test_data = reset_test_data()
	const blt_update = async ({ ballot_id, proposal_id, membership_id, ballot_approved, ballot_comments }) => {
		return await api_proposal_client.ballot_update({
			ballot_id,
			proposal_id,
			membership_id,
			ballot_approved,
			ballot_comments
		})
	}

	// success
	test('Success', async () => {
		const test_blt = {
			ballot_id: test_data['ballot'][ 'cmp_au_2']['id'],
			proposal_id: test_data['ballot']['cmp_au_2']['proposal_id'],
			membership_id: test_data['ballot'][ 'cmp_au_2']['membership_id'],
			ballot_approved: false,
			ballot_comments: 'qwer'
		}
		await expect(blt_update(test_blt)).resolves.toMatchObject(test_blt)
	})

	// error: invalid ballot id
	test('Error: Invalid ballot id', async () => {
		const test_blt = {
			ballot_id: test_data['ballot'][ 'cmp_au_2']['membership_id'],
			proposal_id: test_data['ballot']['cmp_au_2']['proposal_id'],
			membership_id: test_data['ballot'][ 'cmp_au_2']['membership_id'],
			ballot_approved: false,
			ballot_comments: 'qwer'
		}
		await expect(blt_update(test_blt)).rejects.toThrow(Error) // TODO: real error	
	})

	// error: invalid proposal id
	test('Error: Invalid proposal id', async () => {
		const test_blt = {
			ballot_id: test_data['ballot'][ 'cmp_au_2']['id'],
			proposal_id: test_data['ballot'][ 'cmp_au_2']['id'],
			membership_id: test_data['ballot'][ 'cmp_au_2']['membership_id'],
			ballot_approved: false,
			ballot_comments: 'qwer'
		}
		await expect(blt_update(test_blt)).rejects.toThrow(Error) // TODO: real error	
	})

	// error: invalid membership id
	test('Error: Invalid membership id', async () => {
		const test_blt = {
			ballot_id: test_data['ballot'][ 'cmp_au_2']['id'],
			proposal_id: test_data['ballot']['cmp_au_2']['proposal_id'],
			membership_id: test_data['ballot']['cmp_au_2']['proposal_id'],
			ballot_approved: false,
			ballot_comments: 'qwer'
		}
		await expect(blt_update(test_blt)).rejects.toThrow(Error) // TODO: real error	
	})

	// error: invalid ballot approved
	test('Error: Invalid ballot approved', async () => {
		const test_blt = {
			ballot_id: test_data['ballot'][ 'cmp_au_2']['id'],
			proposal_id: test_data['ballot']['cmp_au_2']['proposal_id'],
			membership_id: test_data['ballot'][ 'cmp_au_2']['membership_id'],
			ballot_approved: 'qwer',
			ballot_comments: 'qwer'
		}
		await expect(blt_update(test_blt)).rejects.toThrow(Error) // TODO: real error	
	})
})
