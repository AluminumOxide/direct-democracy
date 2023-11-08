const api_democracy_client = new (require('@AluminumOxide/direct-democracy-democracy-api-client'))()

const test_data = require('./test.json')

describe('Democracy', () => {
	
	describe('List', () => {
		test('Success', async () => {
			const dems = await api_democracy_client.democracy_list({
			})
			expect(true) // TODO
		})	
	})
	
	describe('Root', () => {	
		test('Success', async () => {
			const dem = await api_democracy_client.democracy_root({})
			expect(true) // TODO
		})
	})

	describe('Read', () => {
		test('Success', async () => {
			const dem = await api_democracy_client.democracy_read({
				democracy_id: test_data['democracy']['root_child']['id']
			})
			expect(true) // TODO 
		})
	})

	describe('Population', () => {
		test('Success', async () => {
			const dem = await api_democracy_client.democracy_population_update({})
			expect(true) // TODO
		})	
	})

	describe('Apply', () =>  {
		test('Success', async () => {
			const dem = await api_democracy_client.apply_proposal({
				proposal_id: test_data['proposal']['child_metas_pass']['id']
			})
			expect(true) // TODO
		})
	})
})
