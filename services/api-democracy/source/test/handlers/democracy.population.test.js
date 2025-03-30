const {
	errors,
	get_uuid,
	get_first_uuid,
	get_timestamp,
	get_first_timestamp,
	get_dummy_lib,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	integration_test_setup,
	democracy_population_unit: dem_pop_u,
	democracy_read_integration: dem_read_i,
	democracy_population_integration: dem_pop_i,
	membership_create_integration: mem_crt_i
} = require('../helper')

describe('Population', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		// success: population updates
		test('Success: Population updates integration', async() => {

			// check democracy population
			const start_time = get_timestamp()
			await dem_pop_i(get_first_timestamp(), start_time)
			const dem1 = await dem_read_i(test_data['democracy']['root'].id)

			// create democracy memberships
			const dem_id = test_data['democracy']['root'].id
			const mem1 = await mem_crt_i(dem_id, get_uuid())
			const mem2 = await mem_crt_i(dem_id, get_uuid())
			const mem3 = await mem_crt_i(dem_id, get_uuid())

			// update population
			await dem_pop_i(start_time, get_timestamp())	

			// re-check democracy population
			const dem2 = await dem_read_i(test_data['democracy']['root'].id)
			expect(dem1.democracy_population_verified).toBe(dem2.democracy_population_verified)
			expect(dem2.democracy_population_unverified-dem1.democracy_population_unverified).toBe(3)
		})

		// success: no population updates
		test('Success: No population updates', async() => {

			// check democracy population
			await dem_pop_i(get_first_timestamp(), get_timestamp())
			const dem1 = await dem_read_i(test_data['democracy']['root'].id)

			// update population
			await dem_pop_i(get_timestamp(), get_timestamp())
			
			// re-check democracy population
			const dem2 = await dem_read_i(test_data['democracy']['root'].id)
			expect(dem1.democracy_population_verified).toBe(dem2.democracy_population_verified)
			expect(dem1.democracy_population_unverified).toBe(dem2.democracy_population_unverified)
		})
	})

	describe('Unit Tests', () => {

		// success: no data
		test('Success: No data', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: false,
				err: false,
				val: []
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_population',
				val: [],
				err: false
			}])

			// call handler
			await dem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith()

			// check log
			expect(dummy_log.info).toBeCalledTimes(3)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// success: one page
		test('Success: One page', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: false,
				err: false,
				val: []
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_population',
				val: [{
					democracy_id: get_first_uuid(),
					verified: 10,
					unverified: 100
				}],
				err: false
			}])

			// call handler
			await dem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith()

			// check log
			expect(dummy_log.info).toBeCalledTimes(3)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// success: multi page
		test('Success: Multi page', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: false,
				err: false,
				val: []
			}])
			let pops = []
			while(pops.length < 101) {
				pops.push({
					democracy_id: get_first_uuid(),
					verified: 10,
					unverified: 100
				})
			}
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_population',
				val: [],
				err: false,
				call: 2
			},{
				lib: 'api_membership',
				fxn: 'membership_population',
				val: pops,
				err: false,
				call: 1
			}])

			// call handler
			await dem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.send).toBeCalledWith()
			expect(dummy_reply.code).toBeCalledWith(200)
			

			// check log
			expect(dummy_log.info).toBeCalledTimes(4)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		// error: api failure
		test('Error: API failure', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: false,
				err: false,
				val: []
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_population',
				val: new Error('api error'),
				err: true
			}])

			// call handler
			await dem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		// error: db failure
		test('Error: DB failure', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				fxn: 'where',
				args: false,
				err: new Error('db error'),
				val: []
			}])
			const dummy_lib = get_dummy_lib([{
				lib: 'api_membership',
				fxn: 'membership_population',
				val: [{
					democracy_id: get_first_uuid(),
					verified: 10,
					unverified: 100
				}],
				err: false
			}])

			// call handler
			await dem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})
})
