const {
	errors,
	get_uuid,
	get_dummy_db,
	get_dummy_log,
	get_dummy_lib,
	get_dummy_reply,
	integration_test_setup,
	democracy_erase_unit: dem_erase_u,
	democracy_read_integration: dem_read_i,
	democracy_erase_integration: dem_erase_i
} = require('../helper')

describe('Democracy Erase', () => {

	describe('Unit Tests', () => {
	
		test('Success: Name', async () => {

			// set up mocks
			const dummy_req = {  democracy_id: get_uuid(), erase_field: 'name', erase_keys: [] }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				err: false,
				val: {}
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
			        fxn: 'where',
			        err: false,
			        val: [{}]
			}])
			
			// call handler
			await dem_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(204)
			expect(dummy_reply.send).toHaveBeenCalledWith()
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Success: Description', async () => {

			// set up mocks
			const dummy_req = {  democracy_id: get_uuid(), erase_field: 'description', erase_keys: [] }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				err: false,
				val: {}
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
			        fxn: 'where',
			        err: false,
			        val: [{}]
			}])
			
			// call handler
			await dem_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(204)
			expect(dummy_reply.send).toHaveBeenCalledWith()
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Success: Conduct', async () => {

			// set up mocks
			const dummy_req = {  democracy_id: get_uuid(), erase_field: 'conduct', erase_keys: [] }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				err: false,
				val: {}
			},{
				lib: 'lib_json',
				fxn: 'obj_del',
				err: false,
				val: {}
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
			        fxn: 'where',
			        err: false,
			        val: [{}]
			}])
			
			// call handler
			await dem_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(204)
			expect(dummy_reply.send).toHaveBeenCalledWith()

			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Success: Content', async () => {

			// set up mocks
			const dummy_req = {  democracy_id: get_uuid(), erase_field: 'content', erase_keys: [] }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				err: false,
				val: {}
			},{
				lib: 'lib_json',
				fxn: 'obj_del',
				err: false,
				val: {}
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
			        fxn: 'where',
			        err: false,
			        val: [{}]
			}])
			
			// call handler
			await dem_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(204)
			expect(dummy_reply.send).toHaveBeenCalledWith()

			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(1)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Democracy DNE', async () => {

			// set up mocks
			const dummy_req = {  democracy_id: get_uuid(), erase_field: 'name', erase_keys: []  }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				err: true,
				val: errors.democracy_dne
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			
			// call handler
			await dem_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.democracy_dne))
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})
		
		test('Error: Invalid field', async () => {

			// set up mocks
			const dummy_req = {  democracy_id: get_uuid(), erase_field: 'bad', erase_keys: [] }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				err: false,
				val: {}
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			
			// call handler
			await dem_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(400)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.democracy_field))
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(1)
			expect(dummy_log.error).toHaveBeenCalledTimes(0)
		})

		test('Error: DB Error', async () => {

			// set up mocks
			const dummy_req = {  democracy_id: get_uuid(), erase_field: 'name', erase_keys: [] }
			const dummy_log = get_dummy_log()
			const dummy_lib = get_dummy_lib([{
				lib: 'api_democracy',
				fxn: 'democracy_read',
				err: false,
				val: {}
			}])
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
			        fxn: 'where',
			        err: true,
			        val: errors.internal_error
			}])
			
			// call handler
			await dem_erase_u(dummy_req, dummy_reply, dummy_db, dummy_log, dummy_lib)
			
			// check reply
			expect(dummy_reply.code).toHaveBeenCalledWith(500)
			expect(dummy_reply.send).toHaveBeenCalledWith(new Error(errors.internal_error))
			
			// check log
			expect(dummy_log.info).toHaveBeenCalledTimes(0)
			expect(dummy_log.warn).toHaveBeenCalledTimes(0)
			expect(dummy_log.error).toHaveBeenCalledTimes(1)
		})
	})

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success: Name', async () => {
			const old_democracy = test_data.democracy.root
			await dem_erase_i(old_democracy.id, 'name', [])
			const new_democracy = await dem_read_i(old_democracy.id)
			expect(new_democracy.democracy_name).toBe(`Name erased for misconduct ${old_democracy.id}`)
		})
		
		test('Success: Description', async () => {
			const old_democracy = test_data.democracy.root
			await dem_erase_i(old_democracy.id, 'description', [])
			const new_democracy = await dem_read_i(old_democracy.id)
			expect(new_democracy.democracy_description).toBe(`Description erased for misconduct`)
		})
		
		test('Success: Conduct', async () => {
			const old_democracy = test_data.democracy.root
			await dem_erase_i(old_democracy.id, 'conduct', [])
			const new_democracy = await dem_read_i(old_democracy.id)
			expect(new_democracy.democracy_conduct).toMatchObject({})
		})
		
		test('Success: Conduct keys', async () => {
			const old_democracy = test_data.democracy.root
			await dem_erase_i(old_democracy.id, 'conduct', ['Nothing illegal'])
			const new_democracy = await dem_read_i(old_democracy.id)
			expect(Object.keys(new_democracy.democracy_conduct)).toContainEqual('No nazis')
		})
		
		test('Success: Content', async () => {
			const old_democracy = test_data.democracy.root
			await dem_erase_i(old_democracy.id, 'content', [])
			const new_democracy = await dem_read_i(old_democracy.id)
			expect(new_democracy.democracy_content).toMatchObject({})
		})
		
		test('Success: Content keys', async () => {
			const old_democracy = test_data.democracy.root
			await dem_erase_i(old_democracy.id, 'content', ['procs','todo'])
			const new_democracy = await dem_read_i(old_democracy.id)
			expect(Object.keys(new_democracy.democracy_content)).toContainEqual('algos')
		})
		
		test('Error: Democracy DNE', async () => {
			await expect(dem_erase_i(get_uuid(), 'name', [])).rejects.toThrow(new Error(errors.democracy_dne))
		})
	})
})
