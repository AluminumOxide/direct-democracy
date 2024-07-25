const {
	errors,
	get_dummy_api,
	get_dummy_db,
	get_dummy_log,
	get_dummy_reply,
	reset_test_data,
	democracy_population_unit: dem_pop_u,
	democracy_read_integration: dem_read_i,
	democracy_population_integration: dem_pop_i
} = require('../helper')


describe('Population', () => {

	describe('Unit Tests', () => {

		// success: no data
		test('Success: No data', async() => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: false,
				throws_error: false,
				last_val: []
			}])
			get_dummy_api('membership', [{
				fxn: 'membership_population',
				val: [],
				err: false
			}])

			// call handler
			await dem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith()

			// check log
			expect(dummy_log.info).toBeCalledTimes(2)
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
				last_fxn: 'where',
				last_args: false,
				throws_error: false,
				last_val: []
			}])
			get_dummy_api('membership', [{
				fxn: 'membership_population',
				val: [{
					democracy_id: '00000000-0000-0000-0000-000000000000',
					verified: 10,
					unverified: 100
				}],
				err: false
			}])

			// call handler
			await dem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith()

			// check log
			expect(dummy_log.info).toBeCalledTimes(2)
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
				last_fxn: 'where',
				last_args: false,
				throws_error: false,
				last_val: []
			}])
			let pops = []
			while(pops.length < 101) {
				pops.push({
					democracy_id: '00000000-0000-0000-0000-000000000000',
					verified: 10,
					unverified: 100
				})
			}
			get_dummy_api('membership', [{
				fxn: 'membership_population',
				val: pops,
				err: false,
				call: 1
			},{
				fxn: 'membership_population',
				val: [],
				err: false,
				call: 2

			}])

			// call handler
			await dem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith()

			// check log
			expect(dummy_log.info).toBeCalledTimes(3)
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
				last_fxn: 'where',
				last_args: false,
				throws_error: false,
				last_val: []
			}])
			get_dummy_api('membership', [{
				fxn: 'membership_population',
				val: new Error('api error'),
				err: true
			}])

			// call handler
			await dem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log)

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
				last_fxn: 'where',
				last_args: false,
				throws_error: new Error('db error'),
				last_val: []
			}])
			get_dummy_api('membership', [{
				fxn: 'membership_population',
				val: [{
					democracy_id: '00000000-0000-0000-0000-000000000000',
					verified: 10,
					unverified: 100
				}],
				err: false
			}])

			// call handler
			await dem_pop_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})

	describe('Integration Tests', () => {
		const test_data = reset_test_data()
		
		/*TODO: fix:
		// success: population updates
		test('Success: Population updates', async() => {

			// check democracy population
			const dem1 = await dem_read_i(test_data['democracy']['root'].id)
console.log(dem1.democracy_population_unverified, dem1.democracy_population_verified)
			// create democracy memberships
			try {
			const mem_api = require('@AluminumOxide/direct-democracy-membership-api-client')
			jest.restoreAllMocks()
			console.log(mem_api.membership_create)
			const mem1 = await mem_api.membership_create({
				democracy_id: test_data['democracy']['root'].id,
				profile_id: 'profile111'
			})
			console.log(mem1) // why are these undefined?
			} catch(e) {
				console.log("ERR", e)
			}
			//const mem2 = await mem_api.membership_create({
			//	democracy_id: test_data['democracy']['root'].id,
			//	profile_id: 'profile22'
			//})
			//const mem3 = await mem_api.membership_create({
			//	democracy_id: test_data['democracy']['root'].id,
			//	profile_id: 'profile33'
			//})

			//console.log(mem2)
			//console.log(mem3)
			await (new Promise(resolve => setTimeout(resolve, 1000)))
			// update population
			await dem_pop_i()

			// re-check democracy population
			const dem2 = await dem_read_i(test_data['democracy']['root'].id)

console.log(dem2.democracy_population_unverified, dem2.democracy_population_verified)
			//expect((dem2.democracy_population_verified-dem1.democracy_population_verified)).toBe(1)
			expect((dem2.democracy_population_unverified-dem1.democracy_population_unverified)).toBe(3)
		})*/

		// success: no population updates
		test('Success: No population updates', async() => {

			// check democracy population
			const dem1 = await dem_read_i(test_data['democracy']['root'].id)

			// update population
			await dem_pop_i()
			
			// re-check democracy population
			const dem2 = await dem_read_i(test_data['democracy']['root'].id)
			expect(dem1.democracy_population_verified).toBe(dem2.democracy_population_verified)
			expect(dem1.democracy_population_unverified).toBe(dem2.democracy_population_unverified)
		})
	})
})
