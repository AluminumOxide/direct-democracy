const {
	errors,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_api,
	integration_test_setup,
	ballot_read_integration: blt_read_i,
	ballot_list_integration: blt_list_i,
	ballot_verified_unit: blt_verify_u,
	ballot_verified_integration: blt_verify_i
} = require('../helper') 
const api_membership_client = require('@aluminumoxide/direct-democracy-membership-api-client')

describe('Verified', () => {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		// success: no updates
		test('Success: No updates', async () => {
			const date = new Date().toJSON()

			// count verified ballots
			const blt1 = await blt_list_i({
				filter: {
					ballot_verified: {
						op: '=',
						val: true
					}
				}
			})

			// verify ballots
			const actual = await blt_verify_i(date, date)

			// check there are more verified ballots
			const blt2 = await blt_list_i({
				filter: {
					ballot_verified: {
						op: '=',
						val: true
					}
				}
			})
			expect(actual).toEqual("")
			expect(blt1.length).toBe(blt2.length)
		})

		// success: some updates
		test('Success: Some updates', async () => {

			// count verified ballots
			const filter = { ballot_verified: {
						op: '=',
						val: true
					}}
			const sdate = new Date().toJSON()
			const blt1 = await blt_list_i({ filter })

			// verify some memberships
			await api_membership_client.membership_verify({
				membership_id: test_data['ballot']['cmp_au_1'].membership_id 
			})
			await api_membership_client.membership_verify({
				membership_id: test_data['ballot']['cmp_au_2'].membership_id
			})

			// verify ballots
			let edate = new Date()
			edate.setHours(edate.getHours()+1)
			edate = edate.toJSON()
			const actual = await blt_verify_i(sdate, edate)

			// check there are more verified ballots
			const blt2 = await blt_list_i({ filter })
			expect(actual).toEqual("")
			expect(blt2.length).toBe(blt1.length+4) // 2 ballots per member
		})

		// error: no start time
		test('Error: No start time', async () => {
			const date = new Date().toJSON()
			await expect(blt_verify_i(undefined, date)).rejects.toThrow()
		})

		// error: no end time
		test('Error: No end time', async () => {
			const date = new Date().toJSON()
			await expect(blt_verify_i(date, undefined)).rejects.toThrow()
		})

		// error: invalid start time
		test('Error: Invalid start time', async () => {
			const date = new Date().toJSON()
			await expect(blt_verify_i('bad', date)).rejects.toThrow()
		})

		// error: invalid end time
		test('Error: Invalid end time', async () => {
			const date = new Date().toJSON()
			await expect(blt_verify_i(date, 'bad')).rejects.toThrow()
		})
	})

	// TODO: why does this have to be second?
	describe('Unit Tests', () => {

		// success
		test('Success: No updates', async () => {

			// set up mocks
			const dummy_req = { time_start: '2100-01-01T00:00:00', time_end: '2100-01-01T00:00:00' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_api =  get_dummy_api('membership', [{
				fxn: 'membership_list',
				val: [],
				err: false
			}])
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: false,
				throws_error: false,
				last_val: [dummy_req]
			}])
			
			// call handler
			await blt_verify_u(dummy_req, dummy_reply, dummy_db, dummy_log)
			
			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith()
			
			// check log
			expect(dummy_log.info).toBeCalledTimes(3)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Success: Some updates', async () => {

			// set up mocks
			const dummy_req = { time_start: '2100-01-01T00:00:00', time_end: '2100-01-01T00:00:00' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_api =  get_dummy_api('membership', [{
				fxn: 'membership_list',
				val: [{ is_verified: true, membership_id: 'test' }],
				err: false
			}])
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: false,
				throws_error: false,
				last_val: [dummy_req]
			}])
			
			// call handler
			await blt_verify_u(dummy_req, dummy_reply, dummy_db, dummy_log)
			
			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith()
			
			// check log
			expect(dummy_log.info).toBeCalledTimes(3)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Success: Many updates', async () => {

			let mems = []
			for(var i=0;i<101;i++) mems.push({ is_verified: true, membership_id: 'test' })
			
			// set up mocks
			const dummy_req = { time_start: '2100-01-01T00:00:00', time_end: '2100-01-01T00:00:00' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_api =  get_dummy_api('membership', [{
				fxn: 'membership_list',
				val: mems,
				err: false,
				call: 1
			},{
				fxn: 'membership_list',
				val: [],
				err: false,
				call: 2
			}])
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: false,
				throws_error: false,
				last_val: [dummy_req]
			}])
			
			// call handler
			await blt_verify_u(dummy_req, dummy_reply, dummy_db, dummy_log)
			
			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith()
			
			// check log
			expect(dummy_log.info).toBeCalledTimes(4)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: API failure', async () => {

			// set up mocks
			const dummy_req = { time_start: '2100-01-01T00:00:00', time_end: '2100-01-01T00:00:00' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_api =  get_dummy_api('membership', [{
				fxn: 'membership_list',
				val: new Error(),
				err: true
			}])
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: false,
				throws_error: false,
				last_val: [dummy_req]
			}])
			
			// call handler
			await blt_verify_u(dummy_req, dummy_reply, dummy_db, dummy_log)
			
			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error())
			
			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		test('Error: DB failure', async () => {

			// set up mocks
			const dummy_req = { time_start: '2100-01-01T00:00:00', time_end: '2100-01-01T00:00:00' }
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_api =  get_dummy_api('membership', [{
				fxn: 'membership_list',
				val: [{ is_verified: true, membership_id: 'test' }],
				err: false
			}])
			const dummy_db = get_dummy_db([{
				last_fxn: 'where',
				last_args: false,
				throws_error: new Error(),
				last_val: [dummy_req]
			}])
			
			// call handler
			await blt_verify_u(dummy_req, dummy_reply, dummy_db, dummy_log)
			
			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error())
			
			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	})
})
