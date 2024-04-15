const api_proposal_client = require('@AluminumOxide/direct-democracy-proposal-api-client')
const { reset_test_data } = require('../helper')

describe('Close', () => {
	const test_data = reset_test_data()

	const prop_read = async(proposal_id) => {
		return await api_proposal_client.proposal_read({ proposal_id })
	}
	const prop_close = async(proposal_id, passed) => {
		return await api_proposal_client.proposal_close({ proposal_id, passed })
	}

	// success: close passed proposal
	test('Success: Passed', async () => {		
		let test_prop = test_data['proposal']['gchild_content_close']
		await expect(prop_read(test_prop.id)).resolves.toMatchObject({
			'proposal_votable': true,
			'proposal_passed': null
		})
		await prop_close(test_prop.id, true)
		await expect(prop_read(test_prop.id)).resolves.toMatchObject({
			'proposal_votable': false,
			'proposal_passed': true
		})
	})

	// success: close failed proposal
	test('Success: Failed', async () => {		
		let test_prop = test_data['proposal']['root_conduct_fail']
		await expect(prop_read(test_prop.id)).resolves.toMatchObject({
			'proposal_votable': true,
			'proposal_passed': null
		})
		await prop_close(test_prop.id, false)
		await expect(prop_read(test_prop.id)).resolves.toMatchObject({
			'proposal_votable': false,
			'proposal_passed': false
		})
	})

	// error: invalid proposal id
	test('Error: Invalid proposal_id', async () => {
		await expect(prop_close('01cad47c-3ad2-4b95-aa50-fb1b835fda61', true))
			.rejects.toThrow(Error) // TODO: real error
	})

	// error: already closed
	test('Error: Already closed', async () => {
		await expect(prop_close(test_data['proposal']['child_desc_passed']['id'], true))
			.rejects.toThrow(Error) // TODO: real error
	})
})

