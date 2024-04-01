const api_proposal_client = new (require('@AluminumOxide/direct-democracy-proposal-api-client'))()
const { reset_test_data } = require('../helper') 
	
describe('Read', () => {
	const test_data = reset_test_data()
	const blt_read = async (ballot_id) => {
		return await api_proposal_client.ballot_read({ ballot_id })
	}

	// success
	test('Success', async () => {
		let test_blt = test_data['ballot']['rnf_au_1']
		const blt = await blt_read(test_blt.id)
		expect(blt.proposal_id).toBe(test_blt.proposal_id)
		expect(blt.membership_id).toBe(test_blt.membership_id)
		expect(blt.ballot_approved).toBeTruthy()
		expect(blt.ballot_comments).toBe(test_blt.comments)
		expect(blt.ballot_modifiable).toBeFalsy()
	})

	// error: invalid ballot id
	test('Error: Invalid ballot id', async () => {
		await expect(blt_read('3bfe9d51-f065-4774-9d7d-3904d8128098'))
			.rejects.toThrow(Error) // TODO: real error
	})
})
