const api_membership_client = new (require('@AluminumOxide/direct-democracy-membership-api-client'))()
const { reset_test_data } = require('../helper')

describe('Read', () => {
	const test_data = reset_test_data()
	const mem_read = async (id) => {
		return await api_membership_client.membership_read({ membership_id: id })
	}

	// success: unverified
	test('Success: Unverified', async () => {
		const test_mem = test_data['membership']['unverified_root_1']
		const mem = await mem_read(test_mem.id)
		expect(mem.membership_id).toBe(test_mem.id)
		expect(mem.democracy_id ).toBe(test_mem.democracy_id)
		expect(mem.profile_id).toBe(test_mem.profile_id)
		expect(mem.is_verified).toBeFalsy()
		expect(mem.date_created).toBeDefined()
		expect(mem.date_updated).toBeDefined()
	})

	// success: verified
	test('Success: Verified', async () => {
		const test_mem = test_data['membership']['verified_root_1']
		const mem = await mem_read(test_mem.id)
		expect(mem.membership_id).toBe(test_mem.id)
		expect(mem.democracy_id ).toBe(test_mem.democracy_id)
		expect(mem.profile_id).toBe(test_mem.profile_id)
		expect(mem.is_verified).toBeTruthy()
		expect(mem.date_created).toBeDefined()
		expect(mem.date_updated).toBeDefined()
	})

	// error: invalid membership id
	test('Error: Invalid membership id', async () => {
		await expect(mem_read('acd16c5f-7abe-4ce9-ac3b-a74804af1f56')).rejects
			.toThrow(Error) // TODO: real error
	})
})
