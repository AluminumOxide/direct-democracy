const api_proposal_client = require('@aluminumoxide/direct-democracy-proposal-api-client')
const { reset_test_data } = require('../helper') 


describe('List', () => {
	const test_data = reset_test_data()

	test('List all', async () => {
		const props = await api_proposal_client.proposal_list({})
		expect(props.length).toBe(5)
	})

	// TODO: list been broken
	//test('Sort by name asc', async () => {
	//	const props = await api_proposal_client.proposal_list({
	//		sort: 'proposal_name'
	//	})
	//	expect(props[0].proposal_id).toBe(test_data['proposal']['root_conduct_fail'].id)
	//})
	// sort by date_created desc
	// sort by date_updated asc
	// filter by democracy_id equals
	// filter by membership_id in list
	// filter by proposal_name not in list
	// filter by proposal_description contains
	// filter by proposal_target not equal
	// filter by proposal_votes_yes greater than
	// filter by proposal_votes_no less than
	// filter by proposal_votable equals
	// filter by proposal_passed not equal
	// filter by date_created greater than
	// filter by date_updated less than
	// limit & last
})
