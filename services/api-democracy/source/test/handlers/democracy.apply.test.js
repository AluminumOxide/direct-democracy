const api_democracy_client = new (require('@AluminumOxide/direct-democracy-democracy-api-client'))()
const { reset_test_data } = require('../helper')
   
describe('Apply', () =>  {
	const test_data = reset_test_data()
	test('Success', async () => {
		const dem = await api_democracy_client.apply_proposal({
			proposal_id: test_data['proposal']['child_metas_pass']['id']
		})
		expect(true) // TODO
	})
})
