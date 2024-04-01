const api_proposal_client = new (require('@AluminumOxide/direct-democracy-proposal-api-client'))()
const { reset_test_data } = require('../helper')

describe('Read', () => {
	const test_data = reset_test_data()
	const prop_read = async (proposal_id) => {
		return await api_proposal_client.proposal_read({ proposal_id })
	}
	
	// success
	test('Success', async () => {
		let test_prop = test_data['proposal']['root_name_failed']
		const prop = await prop_read(test_prop.id)
		expect(prop.proposal_id).toBe(test_prop.id)
		expect(prop.democracy_id).toBe(test_prop.democracy_id)
		expect(prop.membership_id).toBe(test_prop.membership_id)
		expect(prop.proposal_name).toBe(test_prop.name)
		expect(prop.proposal_description).toBe(test_prop.description)
		expect(prop.proposal_target).toBe(test_prop.target)
		expect(prop.proposal_changes).toMatchObject(test_prop.changes)
		expect(prop.proposal_votable).toBe(false)
		expect(prop.proposal_passed).toBe(false)
		expect(prop.proposal_votes.unverified.no).toBe(0)
		expect(prop.proposal_votes.unverified.yes).toBe(1)
		expect(prop.proposal_votes.verified.no).toBe(2)
		expect(prop.proposal_votes.verified.yes).toBe(0)
	})

	// error: invalid proposal id
	test('Error: Invalid proposal id', async () => {
		await expect(prop_read('d3a48d83-eace-4097-bdd9-c0116b7f1475'))
			.rejects.toThrow(Error) // TODO: real error
	})
})
