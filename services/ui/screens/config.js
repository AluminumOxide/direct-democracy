const api = require('@aluminumoxide/direct-democracy-external-api-client')

// TODO: get defns from api

const dem_defn_list = async function() {
	let dems = await api.democracy_list({})
	return dems.reduce((a,v) => Object.assign(a, {
		[v.democracy_id]: v.democracy_name
	}), {})
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
	        format: 'object',
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
	proposal_target: {
	        title: 'Target',
	        format: 'enum',
	        display: false,
	        sort: false,
	        filters: ['=','!='],
		opts: { fetch: async() => { return {
			'democracy_name': 'Democracy Name',
			'democracy_description': 'Democracy Description',
			'democracy_conduct': 'Code of Conduct',
			'democracy_content': 'Democracy Content',
			'democracy_metas': 'Democracy Content Rules'
		} } }
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
	return props.reduce((a,v) => Object.assign(a, {
		[v.proposal_id]: v.proposal_name
	}), {})
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
	is_verified: {
	        title: 'Verified?',
	        format: 'boolean',
	        display: false,
	        sort: false,
	        filters: ['=','!=']
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


export default {
	defn: {
		democracy: democracy_defn,
		proposal: proposal_defn,
		ballot: ballot_defn,
		membership: membership_defn,
	}
}
