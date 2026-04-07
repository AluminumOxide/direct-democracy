const api = require('@aluminumoxide/direct-democracy-external-api-client')

// TODO: get defns from api

const dem_defn_list = async function() {
	let dems = await api.democracy_list({})
	return dems.map((v) => ({ id: v.democracy_id, name: v.democracy_name }))
}

const dem_defn_read = async function(democracy_id) {
	return await api.democracy_read({ democracy_id })
}

const democracy_defn = {
	democracy_name: {
	        title: 'Name',
	        format: 'string',
	        display: true,
	        sort: false,
	        filters: ['~']
	},
	democracy_description: {
	        title: 'Description',
	        format: 'multiline',
	        display: true,
	        sort: false,
	        filters: ['~']
	},
	democracy_population_verified: {
	        title: 'Verified Population',
	        format: 'integer',
	        display: false,
	        sort: 'DESC',
	        filters: ['=','!=','>=','>','<=','<']
	},
	democracy_population_unverified: {
	        title: 'Unverified Population',
	        format: 'integer',
	        display: false,
	        sort: false,
	        filters: ['=','!=','>=','>','<=','<']
	},
	date_created: {
	        title: 'Created',
	        format: 'date',
	        display: false,
	        sort: false,
	        filters: ['=','!=','>=','>','<=','<']
	},
	date_updated: {
	        title: 'Updated',
	        format: 'date',
	        display: false,
	        sort: false,
	        filters: ['=','!=','>=','>','<=','<']
	},
	democracy_parent: {
	        title: 'Parent Democracy',
	        format: 'uuid',
		opts: { link: 'DemocracyView', fetch: dem_defn_list },
	        filters: ['=','!=']
	},
	democracy_children: {
	        title: 'Children Democracy',
	        format: 'array',
		opts: { link: 'DemocracyView', format: 'uuid' },
		filters: []
	},
	democracy_conduct: {
	        title: 'Code of Conduct',
	        format: 'array',
		opts: { format: 'object' },
	        filters: ['~']
	},
	democracy_metas: {
	        title: 'Content Rules',
	        format: 'object',
	        filters: ['~']
	},
	democracy_content: {
	        title: 'Democracy Content',
	        format: 'object',
	        filters: ['~']
	},

}
const proposal_defn = {
	proposal_target: {
	        title: 'Target',
	        format: 'enum',
	        display: true,
	        sort: false,
	        filters: ['=','!='],
		opts: { vals: [
			{id: 'democracy_name', 		name: 'Democracy Name'},
			{id: 'democracy_description',	name: 'Democracy Description'},
			{id: 'democracy_conduct',	name: 'Code of Conduct'},
			{id: 'democracy_content',	name: 'Democracy Content'},
			{id: 'democracy_metas',		name: 'Democracy Content Rules'},
			{id: 'democracy_children',	name: 'New Democracy'},
			{id: 'democracy_members',	name: 'Membership Verification'}
		]}
	},
	proposal_name: {
	        title: 'Name',
	        format: 'string',
	        display: true,
	        sort: false,
	        filters: ['~']
	},
	proposal_description: {
	        title: 'Description',
	        format: 'multiline',
	        display: true,
	        sort: false,
	        filters: ['~']
	},
	democracy_id: {
	        title: 'Democracy',
	        format: 'uuid',
		opts: { link: 'DemocracyView', fetch: dem_defn_list },
	        display: false,
	        sort: false,
	        filters: ['=','!=']
	},
	proposal_changes: {
	        title: 'Changes',
	        format: 'object',
	        display: false,
	        sort: false,
	        filters: ['~'],
		opts: {
			parent_field: 'proposal_target',
			parent_update: 'value',
			fetch: dem_defn_read
		}
	},
	proposal_votable: {
		title: 'Votable',
		format: 'boolean',
	        filters: ['=','!=']
	},
	proposal_passed: {
		title: 'Passed',
		format: 'boolean',
	        filters: ['=','!=']
	},
	date_created: {
	        title: 'Created',
	        format: 'date',
	        display: false,
	        sort: false,
	        filters: ['=','!=','>=','>','<=','<']
	},
	date_updated: {
	        title: 'Updated',
	        format: 'date',
	        display: false,
	        sort: false,
	        filters: ['=','!=','>=','>','<=','<']
	}
}


const prop_defn_list = async function() {
	let props = await api.proposal_list({})
	return props.map((v) => ({ id: v.proposal_id, name: v.proposal_name }))
}
const ballot_defn = {
	proposal_id: {
	        title: 'Proposal',
	        format: 'uuid',
		opts: { link: 'ProposalView', fetch: prop_defn_list },
	        display: true,
	        sort: false,
	        filters: ['=','!=']
	},
	ballot_approved: {
	        title: 'Approved?',
	        format: 'boolean',
	        display: true,
	        sort: false,
	        filters: ['=','!=']
	},
	ballot_comments: {
	        title: 'Comments',
	        format: 'multiline',
	        display: true,
	        sort: false,
	        filters: ['=','!=','>=','>','<=','<','~']
	},
	ballot_verified: {
	        title: 'Verified?',
	        format: 'boolean',
	        display: false,
	        sort: false,
	        filters: ['=','!=']
	},
	ballot_modifiable: {
	        title: 'Modifiable?',
	        format: 'boolean',
	        display: false,
	        sort: false,
	        filters: ['=','!=']
	},
	date_created: {
	        title: 'Created',
	        format: 'date',
	        display: false,
	        sort: true,
	        filters: ['=','!=','>=','>','<=','<']
	},
	date_updated: {
	        title: 'Updated',
	        format: 'date',
	        display: false,
	        sort: false,
	        filters: ['=','!=','>=','>','<=','<']
	},
	ballot_id: {
		title: 'Ballot ID',
		format: 'uuid',
		opts: { link: 'BallotView' },
	}
}


const membership_defn = {
	democracy_id: {
	        title: 'Democracy',
	        format: 'uuid',
		opts: { link: 'DemocracyView', fetch: dem_defn_list },
	        display: true,
	        sort: false,
	        filters: ['=','!=']
	},
	status: {
	        title: 'Status',
	        format: 'string',
	        display: false,
	        sort: false,
	        filters: ['=','!=']
	},
	is_verified: {
	        title: 'Verified?',
	        format: 'boolean',
	        display: false,
	        sort: false,
	        filters: ['=','!=']
	},
	is_verifying: {
	        title: 'Verifying?',
	        format: 'boolean',
	        display: false,
	        sort: false,
	        filters: ['=','!=']
	},
	in_timeout: {
	        title: 'In Timeout?',
	        format: 'boolean',
	        display: false,
	        sort: false,
	        filters: ['=','!=']
	},
	timeout_end: {
	        title: 'Timeout End',
	        format: 'date',
	        display: false,
	        sort: false,
	        filters: ['=','!=','>=','>','<=','<']
	},
	timeout_history: {
	        title: 'Timeout History',
	        format: 'array',
		opts: { link: 'ProposalView', format: 'uuid' },
		filters: []
	},
	date_created: {
	        title: 'Created',
	        format: 'date',
	        display: true,
	        sort: false,
	        filters: ['=','!=','>=','>','<=','<']
	},
	date_updated: {
	        title: 'Updated',
	        format: 'date',
	        display: false,
	        sort: false,
	        filters: ['=','!=','>=','>','<=','<']
	}
}

const default_metas = {
	"democracy_name": {
		"update": {
			"approval_percent_minimum": 75
		},
		"close": {
			"lifetime_maximum_days": 30
		}
	},
	"democracy_description": {
		"update": {
			"approval_percent_minimum": 75
		},
		"close": {
			"lifetime_maximum_days": 30
		}
	},
	"democracy_children": {
		"add": {
			"approval_number_minimum": 20
		},
		"close": {
			"lifetime_maximum_days": 30
		}
	},
	"democracy_members": {
		"update": {
			"approval_number_minimum": 5
		},
		"close": {
			"lifetime_maximum_days": 30
		}
	},
	"democracy_content": {
		"add": {
			"approval_percent_minimum": 50
		},
		"update": {
			"approval_percent_minimum": 50
		},
		"delete": {
			"approval_percent_minimum": 50
		},
		"close": {
			"lifetime_maximum_days": 30
		}
	},
	"democracy_conduct": {
		"add": {
			"approval_percent_minimum": 75
		},
		"update": {
			"approval_percent_minimum": 75
		},
		"delete": {
			"approval_percent_minimum": 75
		},
		"close": {
			"lifetime_maximum_days": 30
		}
	},
	"democracy_metas": {
		"democracy_name": {
			"update": {
				"add": {
					"approval_percent_minimum": 75
				},
				"update": {
					"approval_percent_minimum": 75
				},
				"delete": {
					"approval_percent_minimum": 75
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			},
			"close": {
				"add": {
					"approval_percent_minimum": 50
				},
				"update": {
					"approval_percent_minimum": 50
				},
				"delete": {
					"approval_percent_minimum": 50
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			}
		},
		"democracy_description": {
			"update": {
				"add": {
					"approval_percent_minimum": 75
				},
				"update": {
					"approval_percent_minimum": 75
				},
				"delete": {
					"approval_percent_minimum": 75
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			},
			"close": {
				"add": {
					"approval_percent_minimum": 50
				},
				"update": {
					"approval_percent_minimum": 50
				},
				"delete": {
					"approval_percent_minimum": 50
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			}
		},
		"democracy_children": {
			"add": {
				"add": {
					"approval_percent_minimum": 50
				},
				"update": {
					"approval_percent_minimum": 50
				},
				"delete": {
					"approval_percent_minimum": 50
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			},
			"close": {
				"add": {
					"approval_percent_minimum": 50
				},
				"update": {
					"approval_percent_minimum": 50
				},
				"delete": {
					"approval_percent_minimum": 50
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			}
		},
		"democracy_members": {
			"update": {
				"add": {
					"approval_percent_minimum": 50
				},
				"update": {
					"approval_percent_minimum": 50
				},
				"delete": {
					"approval_percent_minimum": 50
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			},
			"close": {
				"add": {
					"approval_percent_minimum": 50
				},
				"update": {
					"approval_percent_minimum": 50
				},
				"delete": {
					"approval_percent_minimum": 50
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			}
		},
		"democracy_conduct": {
			"add": {
				"add": {
					"approval_percent_minimum": 75
				},
				"update": {
					"approval_percent_minimum": 75
				},
				"delete": {
					"approval_percent_minimum": 75
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			},
			"update": {
				"add": {
					"approval_percent_minimum": 75
				},
				"update": {
					"approval_percent_minimum": 75
				},
				"delete": {
					"approval_percent_minimum": 75
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			},
			"delete": {
				"add": {
					"approval_percent_minimum": 75
				},
				"update": {
					"approval_percent_minimum": 75
				},
				"delete": {
					"approval_percent_minimum": 75
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			},
			"close": {
				"add": {
					"approval_percent_minimum": 50
				},
				"update": {
					"approval_percent_minimum": 50
				},
				"delete": {
					"approval_percent_minimum": 50
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			}
		},
		"democracy_content": {
			"add": {
				"add": {
					"approval_percent_minimum": 50
				},
				"update": {
					"approval_percent_minimum": 50
				},
				"delete": {
					"approval_percent_minimum": 50
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			},
			"update": {
				"add": {
					"approval_percent_minimum": 50
				},
				"update": {
					"approval_percent_minimum": 50
				},
				"delete": {
					"approval_percent_minimum": 50
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			},
			"delete": {
				"add": {
					"approval_percent_minimum": 50
				},
				"update": {
					"approval_percent_minimum": 50
				},
				"delete": {
					"approval_percent_minimum": 50
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			},
			"close": {
				"add": {
					"approval_percent_minimum": 50
				},
				"update": {
					"approval_percent_minimum": 50
				},
				"delete": {
					"approval_percent_minimum": 50
				},
				"close": {
					"lifetime_maximum_days": 30
				}
			}
		}
	}
}

export default {
	defn: {
		democracy: democracy_defn,
		proposal: proposal_defn,
		ballot: ballot_defn,
		membership: membership_defn,
	},
	defaults: {
		metas: default_metas
	}
}
