const api_proposal_client = new (require('@AluminumOxide/direct-democracy-proposal-api-client'))()
const { reset_test_data } = require('../helper') 
	
describe('Delete', () => {
	const test_data = reset_test_data()
	const blt_read = async (ballot_id) => {
		return await api_proposal_client.ballot_read({ ballot_id })
	}
	const blt_del = async (ballot_id, proposal_id) => {
		return await api_proposal_client.ballot_delete({ ballot_id, proposal_id })
	}

	// success
	test('Success', async () => {
		let bltid = test_data['ballot']['rcf_dv_1']['id']
		let propid = test_data['ballot']['rcf_dv_1']['proposal_id']
		await expect(blt_read(bltid)).resolves.toBeInstanceOf(Object)
		await blt_del(bltid, propid)
		await expect(blt_read(bltid)).rejects.toThrow(Error) // TODO: real error
	})

	// error: invalid ballot_id
	test('Error: Invalid ballot id', async () => {
		let propid = test_data['ballot']['rcf_dv_1']['proposal_id']
		await expect(blt_del(propid, propid))
			.rejects.toThrow(Error) // TODO: real error
	})

	// error: invalid proposal_id
	test('Error: Invalid proposal id', async () => {
		let bltid = test_data['ballot']['rcf_dv_1']['id']
		await expect(blt_del(bltid, bltid))
			.rejects.toThrow(Error) // TODO: real error
	})

	// error: ballot not modifiable
	test('Error: Ballot not modifiable', async () => {
		let bltid = test_data['ballot']['rnf_au_1']['id']
		let propid = test_data['ballot']['rnf_au_1']['proposal_id']
		await expect(blt_del(bltid, propid))
			.rejects.toThrow(Error) // TODO: real error
	})
})
