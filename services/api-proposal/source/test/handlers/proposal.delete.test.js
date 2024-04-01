const api_proposal_client = new (require('@AluminumOxide/direct-democracy-proposal-api-client'))()
const { reset_test_data } = require('../helper') 

describe('Delete', () => {
	const test_data = reset_test_data()
	const prop_read = async(proposal_id) => {
		return await api_proposal_client.proposal_read({ proposal_id })
	}
	const prop_del = async(proposal_id) => {
		return await api_proposal_client.proposal_delete({ proposal_id })
	}

	// success
	test('Success', async () => {
		const prop_id = test_data['proposal']['gchild_content_close']['id']
		await expect(prop_read(prop_id)).resolves.toBeInstanceOf(Object)
		await prop_del(prop_id)	
		await expect(prop_read(prop_id)).rejects.toThrow(Error) // TODO: real error
	})

	// error: invalid proposal_id
	test('Error: Invalid proposal id', async () => {
		await expect(prop_del('301d37ea-6597-4ec1-8491-6175220089f2'))
			.rejects.toThrow(Error) // TODO: real error
	})
	
	// error: ballots have been cast
	test('Error: Ballots have been cast', async () => {
		await expect(prop_del(test_data['proposal']['root_conduct_fail']['id']))
			.rejects.toThrow(Error) // TODO: real error
	})

})

