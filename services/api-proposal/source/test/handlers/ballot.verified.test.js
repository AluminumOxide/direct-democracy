const api_proposal_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
const { reset_test_data } = require('../helper') 

describe('Verified', () => {
	test('Success', async () => {
		const test_data = await reset_test_data()
		const blt = await api_proposal_client.ballot_verified({})
		expect(true) // TODO 
	})
})
