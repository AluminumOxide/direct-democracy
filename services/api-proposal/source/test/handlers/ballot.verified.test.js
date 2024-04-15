const api_proposal_client = require('@AluminumOxide/direct-democracy-proposal-api-client')
const { reset_test_data } = require('../helper') 

describe('Verified', () => {
	const test_data = reset_test_data()
	test('Success', async () => {
		const blt = await api_proposal_client.ballot_verified({})
		expect(true) // TODO 
	})
})
