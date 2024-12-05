const {
	sinon,
	errors,
	get_uuid,
	get_dummy_log,
	get_dummy_reply,
	get_dummy_db,
	get_dummy_api,
	integration_test_setup,
	democracy_apply_unit: dem_apply_u,
	democracy_apply_integration: dem_apply_i,
	democracy_read_integration: dem_read_i,
	proposal_read_integration: prop_read_i
} = require('../helper')

describe('Apply', () =>  {

	describe('Integration Tests', () => {

		const test_data = integration_test_setup()

		test('Success: Proposal passed', async () => {

			// get proprosal and democracy before changes
			const prop1 = test_data['proposal']['child_metas_pass']
			const dem1 = await dem_read_i(prop1.democracy_id)

			// call apply
			await dem_apply_i(prop1.id)

			// get proprosal and democracy after changes
			const dem2 = await dem_read_i(prop1.democracy_id)
			const prop2 = await prop_read_i(prop1.id)

			// check that proposal was applied
			expect(dem2.democracy_metas).toMatchObject(dem1.democracy_metas)
			expect(dem1.democracy_metas.name.update.approval_number_minimum).toBeUndefined()
			expect(dem2.democracy_metas.name.update.approval_number_minimum).toBe(1)
			expect(prop1.votable).toBeTruthy()
			expect(prop2.proposal_votable).toBeFalsy()
			expect(prop1.passed).toBeNull()
			expect(prop2.proposal_passed).toBeTruthy()

		})

		test('Error: Proposal DNE', async () => {
			
			await expect(dem_apply_i(get_uuid())).rejects.toThrow(new Error(errors.proposal_dne))

		})

		test('Error: Proposal not votable', async () => {
			
			const prop = test_data['proposal']['root_name_failed']
			await expect(dem_apply_i(prop.id)).rejects.toThrow(new Error(errors.voting_closed))

		})

		// TODO: more integration tests
	})

	describe('Unit Tests', () => {

		test('Success: Proposal passed', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				throws_error: false,
				last_val: [dummy_req]
			}])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					},
					date_created: new Date().toJSON()
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: {},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
						a: {
							c: 3
						}
					},
					democracy_metas: {
						content: {
							add: {
								approval_percent_minimum: 0
							},
							a: {
								add: {
									approval_percent_minimum: 0
								}
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith("")

			// check log
			expect(dummy_log.info).toBeCalledTimes(2)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Success: Proposal not passed', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				throws_error: false,
				last_val: [dummy_req]
			}])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'name',
					proposal_changes: {
						_update: {
							'name': 'test'
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					},
					date_created: new Date().toJSON()
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: {},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_name: 'name',
					democracy_metas: {
						name: {
							update: {
								approval_percent_minimum: 100
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(304)
			expect(dummy_reply.send).toBeCalledWith()

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Success: Proposal closed', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					},
					date_created: new Date().toJSON()
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: {},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
						a: {
							c: 3
						}
					},
					democracy_metas: {
						content: {
							close: {
								lifetime_maximum_days: 0
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							lifetime_maximum_days: 'proposal_days <= value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(204)
			expect(dummy_reply.send).toBeCalledWith("")

			// check log
			expect(dummy_log.info).toBeCalledTimes(2)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Success: No democracy rules', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				throws_error: false,
				last_val: [dummy_req]
			}])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					},
					date_created: new Date().toJSON()
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: {},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
						a: {
							c: 3
						}
					},
					democracy_metas: {},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(200)
			expect(dummy_reply.send).toBeCalledWith("")

			// check log
			expect(dummy_log.info).toBeCalledTimes(2)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: Proposal DNE', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: new Error(errors.proposal_dne),
				err: true
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.proposal_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: Proposal API error', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: new Error(),
				err: true
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Proposal not votable', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: false,
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.voting_closed))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Democracy DNE', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: ''
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: {},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: new Error(errors.democracy_dne),
				err: true
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.democracy_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Democracy API error', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: ''
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: {},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: new Error(),
				err: true
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Root lookup failure', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: ''
				},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {},
				err: false
			},{
				fxn: 'democracy_root',
				val: new Error(),
				err: true
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: No proposal target', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: ''
				},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {},
				err: false
			},{
				fxn: 'democracy_root',
				val: {},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.target_invalid))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: Invalid proposal target', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'bad'
				},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {},
				err: false
			},{
				fxn: 'democracy_root',
				val: {},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.target_invalid))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Missing changes', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'name'
				},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {},
				err: false
			},{
				fxn: 'democracy_root',
				val: {},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.changes_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: Invalid changes', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'name',
					proposal_changes: 'bad'
				},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {},
				err: false
			},{
				fxn: 'democracy_root',
				val: {},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.changes_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Empty changes', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'name',
					proposal_changes: {}
				},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {},
				err: false
			},{
				fxn: 'democracy_root',
				val: {},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.changes_dne))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: Missing algos', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					}
				},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
						a: {
							c: 3
						}
					},
					democracy_metas: {
						content: {
							a: {
								add: {
									approval_percent_minimum: 0
								}
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Missing proposal votes', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					}
				},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
						a: {
							c: 3
						}
					},
					democracy_metas: {
						content: {
							add: {
								approval_percent_minimum: 0
							},
							a: {
								add: {
									approval_percent_minimum: 0
								}
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Invalid proposal votes', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					},
					proposal_votes: {
						verified: {
							yes: 'asdf'
						},
					}
				},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
						a: {
							c: 3
						}
					},
					democracy_metas: {
						content: {
							a: {
								add: {
									approval_percent_minimum: 0
								}
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Missing proposal date', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					}
				},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
						a: {
							c: 3
						}
					},
					democracy_metas: {
						content: {
							a: {
								add: {
									approval_percent_minimum: 0
								}
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Population 0', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					},
					date_created: new Date().toJSON()
				},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
						a: {
							c: 3
						}
					},
					democracy_metas: {
						content: {
							a: {
								add: {
									approval_percent_minimum: 0
								}
							}
						}
					},
					democracy_population_verified: 0
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.democracy_pop))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
	
		test('Error: DB update', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				throws_error: false,
				last_val: []
			}])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					},
					date_created: new Date().toJSON()
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: {},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
						a: {
							c: 3
						}
					},
					democracy_metas: {
						content: {
							add: {
								approval_percent_minimum: 0
							},
							a: {
								add: {
									approval_percent_minimum: 0
								}
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})

		test('Error: DB error', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				throws_error: true,
				last_val: []
			}])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					},
					date_created: new Date().toJSON()
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: {},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
						a: {
							c: 3
						}
					},
					democracy_metas: {
						content: {
							add: {
								approval_percent_minimum: 0
							},
							a: {
								add: {
									approval_percent_minimum: 0
								}
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
			
		test('Error: Invalid changes', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					},
					date_created: new Date().toJSON()
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: {},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
					},
					democracy_metas: {
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.changes_invalid))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})

		test('Error: Missing algo', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				throws_error: false,
				last_val: [dummy_req]
			}])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'name',
					proposal_changes: {
						_update: {
							'name': 'test'
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					},
					date_created: new Date().toJSON()
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: {},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_name: 'name',
					democracy_metas: {
						name: {
							update: {
								bad_algo: 100
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.algo_missing))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Proposal did not close', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'name',
					proposal_changes: {
						_update: {
							'name': 'test'
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					},
					date_created: new Date().toJSON()
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: new Error(errors.internal_error),
				err: true
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_name: 'name',
					democracy_metas: {
						name: {
							update: {
								approval_percent_minimum: 0
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)
		})
		
		test('Error: Changes invalid error should not happen', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([{
				last_fxn: 'returning',
				last_args: ['*'],
				throws_error: new Error(errors.changes_invalid),
				last_val: []
			}])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					},
					date_created: new Date().toJSON()
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: {},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
						a: {
							c: 3
						}
					},
					democracy_metas: {
						content: {
							add: {
								approval_percent_minimum: 0
							},
							a: {
								add: {
									approval_percent_minimum: 0
								}
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// check reply
			expect(dummy_reply.code).toBeCalledWith(400)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.changes_invalid))

			// check log
			expect(dummy_log.info).toBeCalledTimes(1)
			expect(dummy_log.warn).toBeCalledTimes(1)
			expect(dummy_log.error).toBeCalledTimes(0)
		})
		
		test('Error: JSON changes error', async () => {

			// set up mocks
			const dummy_req = {}
			const dummy_log = get_dummy_log()
			const dummy_reply = get_dummy_reply()
			const dummy_db = get_dummy_db([])
			get_dummy_api('proposal', [{
				fxn: 'proposal_read',
				val: {
					proposal_votable: true,
					democracy_id: '',
					proposal_target: 'content',
					proposal_changes: {
						a: {
							_add: { b: 2 }
						}
					},
					proposal_votes: {
						verified: {
							yes: 1,
							no: 1
						},
					},
					date_created: new Date().toJSON()
				},
				err: false
			},{
				fxn: 'proposal_close',
				val: {},
				err: false
			}])
			get_dummy_api('democracy', [{
				fxn: 'democracy_read', 
				val: {
					democracy_content: {
						a: {
							c: 3
						}
					},
					democracy_metas: {
						content: {
							add: {
								approval_percent_minimum: 0
							},
							a: {
								add: {
									approval_percent_minimum: 0
								}
							}
						}
					},
					democracy_population_verified: 1
				},
				err: false
			},{
				fxn: 'democracy_root',
				val: {
					democracy_content: {
						algos: {
							approval_percent_minimum: 'approved_votes > value'
						}
					}
				},
				err: false
			}])

			// mock json changes lib
			const json_changes = require('@aluminumoxide/direct-democracy-lib-json-changes')
			json_changes.check_changes = sinon.stub()
			json_changes.check_changes.throws(new Error())

			// call handler
			await dem_apply_u(dummy_req, dummy_reply, dummy_db, dummy_log)

			// restore json changes lib
			sinon.restore()

			// check reply
			expect(dummy_reply.code).toBeCalledWith(500)
			expect(dummy_reply.send).toBeCalledWith(new Error(errors.internal_error))

			// check log
			expect(dummy_log.info).toBeCalledTimes(0)
			expect(dummy_log.warn).toBeCalledTimes(0)
			expect(dummy_log.error).toBeCalledTimes(1)

		})
	})
})
