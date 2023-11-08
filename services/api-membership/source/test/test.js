const api_membership_client = new (require('@AluminumOxide/direct-democracy-membership-api-client'))()

const test_data = require('./test.json')
let memid

describe('Membership', () => {

	describe('List', () => {
		test('Success', async () => {
			const mems = await api_membership_client.membership_list({
			})
			expect(true) // TODO
		})
	})

	describe('Read', () => {
		test('Success', async () => {
			const mems = await api_membership_client.membership_read({
				membership_id: test_data['membership']['verified_root_1']['id']
			})
			expect(true) // TODO
		})
	})

	describe('Create', () => {
		test('Success', async () => {
			const mems = await api_membership_client.membership_create({
				democracy_id: test_data['democracy']['root_child']['id'],
				profile_id: test_data['membership']['unverified_root_1']['profile_id']
			})
			memid = mems['membership_id']
			expect(true) // TODO
		})
	})

	describe('Delete', () => {
		test('Success', async () => {
			const mems = await api_membership_client.membership_delete({
				membership_id: memid,
				profile_id: test_data['membership']['unverified_root_1']['profile_id']
			})
			expect(true) // TODO
		})
	})

	describe('Population', () => {
		test('Success', async () => {
			const mems = await api_membership_client.membership_population({})
			expect(true) // TODO
		})
	})
})
