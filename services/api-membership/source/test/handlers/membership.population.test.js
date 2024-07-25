const { 
	errors,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	reset_test_data,
	membership_population_unit: mem_pop_u,
	membership_population_integration: mem_pop_i
} = require('../helper')

describe('Population', () => {

	describe('Unit Tests', () => {

		// success
		test('Success', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'pageQuery',
				last_args: false,
				last_val: [],
				throws_error: false
			}])

			// call handler
			await mem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith([])

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: database failure
		test('Error: Database failure', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'pageQuery',
				last_args: false,
				last_val: [],
				throws_error: true
			}])

			// call handler
			await mem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})

	/*describe('Integration Tests', () => {
		const test_data = reset_test_data()

		const comp_pops = function(expected, actual) {
			expected.forEach(dem => {
				
			})
		}

		// success: no params
		test('Success', async () => {
			const expected = [{
				democracy_id: test_data['democracy']['root']['id'],
				verified: test_data['democracy']['root']['population_verified'],
				unverified: test_data['democracy']['root']['population_unverified']
			}]
			const mems = await mem_pop_i({})
			expect(mems[2]).toContain(expected[0]) // TODO
		})

		// TODO: success: limit set
		// TODO: success: limit & last set
		// TODO: success: order set
		// TODO: success: filter by democracy_id
		// TODO: success: filter by date_updated
		// TODO: success: filter by verified
		// TODO: success: filter by unverified
		// TODO: success: limit, last, order & filter set
		// TODO: error: invalid limit
		// TODO: error: invalid last
		// TODO: error: invalid order
		// TODO: error: invalid filter

	})*/
})
