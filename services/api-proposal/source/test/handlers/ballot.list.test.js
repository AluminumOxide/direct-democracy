const api_proposal_client = require('@AluminumOxide/direct-democracy-proposal-api-client')
const { reset_test_data } = require('../helper') 
	
describe('List', () => {

	// list all
	test('List all', async () => {
		const test_data = await reset_test_data()
		const blts = await api_proposal_client.ballot_list({})
		expect(blts.length).toBe(23)
	})

	// TODO: list is broken
//	// sort by date_created asc
//	test('Sort by date created asc', async () => {
//		const blts = await api_proposal_client.ballot_list({
//			sort: 'date_created',
//			order: 'ASC'
//		})
//		expect(blts[0].ballot_id).toBe('')
//	})
//	
//	// sort by date_updated desc
//	test('Sort by date updated desc', async () => {
//		const blts = await api_proposal_client.ballot_list({
//			sort: 'date_updated',
//			order: 'DESC'
//		})
//		expect(blts[0].ballot_id).toBe('')
//	})

	//// filter by membership_id in list
	//test('Filter by membership id in list', async () => {
	//	const blts = await api_proposal_client.ballot_list({
	//	})
	//	expect(blts.length).toBe('')
	//})

	// filter by ballot_approved equals
	// filter by ballot_comments contains
	// filter by date_created less than
	// filter by date_updated greater than
	// limit and last
})
