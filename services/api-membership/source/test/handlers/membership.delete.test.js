const api_membership_client = new (require('@AluminumOxide/direct-democracy-membership-api-client'))()
const { reset_test_data } = require('../helper')

const mem_read = async(membership_id) => {
	return await api_membership_client.membership_read({ membership_id })
}
const mem_del = async(membership_id, profile_id) => {
	return await api_membership_client.membership_delete({
		membership_id,
		profile_id
	})
}

describe('Delete', () => {
	const test_data = reset_test_data()

	// success: verified
	test('Success: Verified', async () => {
		const mem_id = test_data['membership']['verified_root_1']['id']
		const pro_id = test_data['membership']['verified_root_1']['profile_id']
		await expect(mem_read(mem_id)).resolves.toBeInstanceOf(Object)
		await mem_del(mem_id, pro_id)
		await expect(mem_read(mem_id)).rejects.toThrow(Error) // TODO: real error
	})

	// success: unverified
	test('Success: Unverified', async () => {
		const mem_id = test_data['membership']['unverified_root_1']['id']
		const pro_id = test_data['membership']['unverified_root_1']['profile_id']
		await expect(mem_read(mem_id)).resolves.toBeInstanceOf(Object)
		await mem_del(mem_id, pro_id)
		await expect(mem_read(mem_id)).rejects.toThrow(Error) // TODO: real error
	})

	// error: membership id invalid
	test('Error: Invalid membership id', async () => {
		await expect(mem_del('68cd7ef4-5fd2-4745-9a7a-e67a6d62ecfc','a60f9594-a763-435e-b8a0-b31e7f21a881'))
			.rejects.toThrow(Error) // TODO: real error
	})

	// error: profile id invalid
	test('Error: Invalid profile id', async () => {
		await expect(mem_del('58cd7ef4-5fd2-4745-9a7a-e67a6d62ecfc','b60f9594-a763-435e-b8a0-b31e7f21a881'))
			.rejects.toThrow(Error) // TODO: real error
	})
	
})
