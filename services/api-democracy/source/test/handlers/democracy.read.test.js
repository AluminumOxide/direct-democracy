const api_democracy_client = require('@AluminumOxide/direct-democracy-democracy-api-client') 
const { reset_test_data } = require('../helper')

const dem_read = async (id) => {
	return await api_democracy_client.democracy_read({ democracy_id: id })
}

describe('Read', () => {

	const test_data = reset_test_data()

	// success: read no parent
	test('Success: No parent', async () => {
		const expected = test_data['democracy']['root']
		const actual = await dem_read(expected.id)
		expect(actual.democracy_id).toBe(expected.id)
		expect(actual.democracy_name).toBe(expected.name)
		expect(actual.democracy_description).toBe(expected.description)
		expect(actual.democracy_conduct).toEqual(expected.conduct)
		expect(actual.democracy_content).toEqual(expected.content)
		expect(actual.democracy_metas).toEqual(expected.metas)
		expect(actual.democracy_parent).toBeNull()
		expect(actual.democracy_children).toEqual([test_data['democracy']['root_child']['id']])
		expect(Object.keys(actual)).toEqual(expect.arrayContaining(['democracy_population_verified','democracy_population_unverified','date_created','date_updated']))
	})

	// success: read parent and child
	test('Success: Parent & children', async () => {
		const expected = test_data['democracy']['root_child']
		const actual = await dem_read(expected.id)
		expect(actual.democracy_id).toBe(expected.id)
		expect(actual.democracy_name).toBe(expected.name)
		expect(actual.democracy_description).toBe(expected.description)
		expect(actual.democracy_conduct).toEqual(expected.conduct)
		expect(actual.democracy_content).toEqual(expected.content)
		expect(actual.democracy_metas).toEqual(expected.metas)
		expect(actual.democracy_parent).toBe(expected.parent_id)
		expect(actual.democracy_children).toEqual([test_data['democracy']['not_root_child']['id']])
		expect(Object.keys(actual)).toEqual(expect.arrayContaining(['democracy_population_verified','democracy_population_unverified','date_created','date_updated']))
	})

	// success: read no children
	test('Success: No children', async () => {
		const expected = test_data['democracy']['not_root_child']
		const actual = await dem_read(expected.id)
		expect(actual.democracy_id).toBe(expected.id)
		expect(actual.democracy_name).toBe(expected.name)
		expect(actual.democracy_description).toBe(expected.description)
		expect(actual.democracy_conduct).toEqual(expected.conduct)
		expect(actual.democracy_content).toEqual(expected.content)
		expect(actual.democracy_metas).toEqual(expected.metas)
		expect(actual.democracy_parent).toBe(expected.parent_id)
		expect(actual.democracy_children).toBeNull()
		expect(Object.keys(actual)).toEqual(expect.arrayContaining(['democracy_population_verified','democracy_population_unverified','date_created','date_updated']))
	})

	// error: no id
	test('Error: No id', async () => {
		await expect(dem_read()).rejects
			.toThrow(Error) // TODO: real error
	})

	// error: non-uuid id
	test('Error: Non-uuid id', async () => {
		await expect(dem_read('asdfasdf')).rejects
			.toThrow(Error) // TODO: real error
	})

	// error: invalid id
	test('Error: Invalid id', async () => {
		await expect(dem_read('fa688244-ebce-40cb-8f39-2a82d1417519')).rejects
			.toThrow(api_democracy_client.errors.democracy_dne)
	})

})
