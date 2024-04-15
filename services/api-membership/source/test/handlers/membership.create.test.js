const api_membership_client = require('@AluminumOxide/direct-democracy-membership-api-client')
const { reset_test_data } = require('../helper')

const mem_create = async (dem_id, pro_id) => {
	return await api_membership_client.membership_create({
		democracy_id: dem_id,
		profile_id: pro_id
	})
}

describe('Create', () => {
	const test_data = reset_test_data()
	const profile_id = 'acd16c5f-7abe-4ce9-ac3b-a74804af1f58'

	// success
	test('Success', async () => {
		const mem = await mem_create(test_data['democracy']['root_child']['id'], profile_id)
		expect(mem.democracy_id).toBe(test_data['democracy']['root_child']['id'])
		expect(mem.profile_id).toBe(profile_id)
		expect(mem.is_verified).toBeFalsy()
		expect(mem.membership_id).toBeDefined()
		expect(mem.date_created).toBeDefined()
		expect(mem.date_updated).toBeNull()
	})

	// error: invalid democracy_id
	test('Error: invalid democracy id', async () => {
		await expect(mem_create('51a9a676-3b1e-47eb-845b-2784ccdd1d50', profile_id)).rejects
			.toThrow(Error) // TODO: real error
	})

	// error: pre-existing membership
	test('Error: pre-existing membership', async () => {
		await expect(mem_create(test_data['membership']['verified_root_1']['democracy_id'],
			test_data['membership']['verified_root_1']['profile_id'])).rejects
			.toThrow(Error) // TODO: real error	
	})	
})
