const {
	errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	reset_test_data,
	ballot_verified_unit: blt_verify_u,
	ballot_verified_integration: blt_verify_i
} = require('../helper') 

describe('Verified', () => {

	/*describe('Unit Tests', () => {

		// success
		test('Success', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: ['democracy.id', dummy_req.democracy_id],
				throws_error: false,
				last_val: [dummy_req]
			}])
			
			// call handler
			await dem_read_u(dummy_req, dummy_reply, dummy_db, dummy_log)
			
			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith(dummy_req)
			
			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
	})*/

	describe('Integration Tests', () => {

		// success: no updates
		test('Success: No updates', async () => {
			const test_data = await reset_test_data()
			const date = new Date().toJSON()
			const actual = await blt_verify_i(date, date)
			expect(actual).toEqual("")
		})

		//TODO success: some updates
		//test('Success: Some updates', async () => {
		//	const test_data = await reset_test_data()
		//	const date = new Date().toJSON()
		//	const actual = await blt_verify_i(date, date)
		//	expect(actual).toEqual("")
		//})

		// error: no start time
		test('Error: No start time', async () => {
			const test_data = await reset_test_data()
			const date = new Date().toJSON()
			await expect(blt_verify_i(undefined, date)).rejects.toThrow()
		})

		// error: no end time
		test('Error: No end time', async () => {
			const test_data = await reset_test_data()
			const date = new Date().toJSON()
			await expect(blt_verify_i(date, undefined)).rejects.toThrow()
		})

		// error: invalid start time
		test('Error: Invalid start time', async () => {
			const test_data = await reset_test_data()
			const date = new Date().toJSON()
			await expect(blt_verify_i('bad', date)).rejects.toThrow()
		})

		// error: invalid end time
		test('Error: Invalid end time', async () => {
			const test_data = await reset_test_data()
			const date = new Date().toJSON()
			await expect(blt_verify_i(date, 'bad')).rejects.toThrow()
		})
	})
})
