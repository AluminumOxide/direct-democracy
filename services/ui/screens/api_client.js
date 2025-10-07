import { useContext } from 'react'
import { AuthContext } from '../contexts/'

import auth from './api_client_auth'
import get_client from './api_client_client'

const api_client = get_client(require('./api_client_spec.json'), {})



const democracy_list = async function({ limit, last, order, sort, filter }) {
	try {
		return await api_client.democracy_list({ limit, last, order, sort, filter})
	} catch (e) {
		console.log(e)
		return [{"democracy_id":"a062d797-8b6a-499c-9d8b-9a0cdf0871bf","democracy_name":"Eartheeee","democracy_description":"Everyone","democracy_population_verified":6,"democracy_population_unverified":5,"date_created":"2025-09-04T03:45:16.180Z","date_updated":"2025-09-04T21:32:11.863Z"},{"democracy_id":"51a9a676-3b1e-47eb-845b-2784ccdd1d59","democracy_name":"Test","democracy_description":"test test test test test ","democracy_population_verified":5,"democracy_population_unverified":5,"date_created":"2025-09-04T03:45:16.180Z","date_updated":"2025-09-04T21:32:11.863Z"},{"democracy_id":"430488ba-7c63-49da-b22d-0435be67f4ef","democracy_name":"Test Two","democracy_description":"test test test","democracy_population_verified":5,"democracy_population_unverified":4,"date_created":"2025-09-04T03:45:16.180Z","date_updated":"2025-09-04T21:32:11.863Z"}]
	}
}

const democracy_read = async function({ democracy_id }) {
	try {
		return await api_client.democracy_read({ democracy_id })	
	} catch(e) {
	        console.log(e)
	        return {"democracy_id":"a062d797-8b6a-499c-9d8b-9a0cdf0871bf","democracy_parent":null,"democracy_children":["51a9a676-3b1e-47eb-845b-2784ccdd1d59"],"democracy_name":"Eartheeee","democracy_description":"Everyone","democracy_population_verified":6,"democracy_population_unverified":5,"democracy_conduct":{"nonazi":"No nazis."},"democracy_content":{"algos":{"lifetime_maximum_days":"proposal_days <= value","lifetime_minimum_days":"proposal_days >= value","approval_number_minimum":"approved_votes >= value","approval_percent_minimum":"(approved_votes/democracy_population)*100 >= value ","disapproval_number_maximum":"disapproved_votes <= value","disapproval_percent_maximum":"(disapproved_votes/democracy_population)*100 <= value"},"procs":{"todo":"todo"}},"democracy_metas":{"name":{"close":{"lifetime_maximum_days":10,"disapproval_number_maximum":1},"update":{"approval_percent_minimum":75}},"metas":{"add":{"approval_percent_minimum":75},"close":{"lifetime_maximum_days":10},"delete":{"approval_percent_minimum":75},"update":{"approval_percent_minimum":75}},"conduct":{"add":{"approval_percent_minimum":75},"close":{"lifetime_maximum_days":10},"delete":{"approval_percent_minimum":75,"disapproval_number_maximum":1},"update":{"approval_percent_minimum":75}},"content":{"add":{"approval_percent_minimum":75},"algos":{"add":{"approval_percent_minimum":75},"close":{"lifetime_maximum_days":10},"delete":{"approval_percent_minimum":75},"update":{"approval_percent_minimum":75}},"close":{"lifetime_maximum_days":10},"procs":{"add":{"approval_percent_minimum":75},"close":{"lifetime_maximum_days":10},"delete":{"approval_percent_minimum":75},"update":{"approval_percent_minimum":75}},"delete":{"approval_percent_minimum":75},"update":{"approval_percent_minimum":75}},"members":{"close":{"lifetime_maximum_days":10},"update":{"approval_number_minimum":5}},"timeouts":{"add":{"approval_number_minimum":5},"close":{"lifetime_maximum_days":10},"delete":{"approval_number_minimum":5},"update":{"approval_number_minimum":5}},"democracies":{"add":{"approval_percent_minimum":75},"close":{"lifetime_maximum_days":10},"delete":{"approval_percent_minimum":75}},"description":{"close":{"lifetime_maximum_days":10},"update":{"approval_percent_minimum":75}}},"date_created":"2025-09-04T03:45:16.180Z","date_updated":"2025-09-05T19:02:14.428Z"}
	}
}

const dem_defn_list = async function() {
	let dems = await democracy_list({})
	return dems.reduce((a,v) => Object.assign(a, {
		[v.democracy_id]: v.democracy_name
	}), {})
}

const dem_defn_read = async function(democracy_id) {
	return await democracy_read({ democracy_id })
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
		opts: {
			'democracy_name': 'Democracy Name',
			'democracy_description': 'Democracy Description',
			'democracy_conduct': 'Code of Conduct',
			'democracy_content': 'Democracy Content',
			'democracy_metas': 'Democracy Content Rules'
		}
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

const proposal_list = async function({ limit, last, order, sort, filter }) {
	try {
		return await api_client.proposal_list({ limit, last, order, sort, filter})
        } catch(e) {
                console.log(e)
                return []
        }
}

const proposal_read = async function({ proposal_id }) {
	try {
		return await api_client.proposal_read({ proposal_id })
	} catch(e) {
		console.log(e)
		return {}
	}
}

const proposal_create = async function({ jwt, democracy_id, proposal_name, proposal_description, proposal_target, proposal_changes }) {
	try {
		return await api_client.proposal_create({ jwt, democracy_id, proposal_name, proposal_description, proposal_target, proposal_changes })
	} catch(e) {
		console.log(e)
		return { 'id':'d3a48d83-eace-4097-bdd9-c0116b7f1474' }
	}
}

const proposal_delete = async function({ proposal_id, jwt }) {
	try {
		return await api_client.proposal_delete({ proposal_id, jwt })
	} catch(e) {
		console.log(e)
		return { 'id':'d3a48d83-eace-4097-bdd9-c0116b7f1474' }
	}
}

const prop_defn_list = async function() {
	let props = await proposal_list({})
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

const ballot_list = async function({ jwt, limit, last, order, sort, filter }) {
	try {
		console.log("FILTER1", filter)
		return await api_client.ballot_my_list({ jwt, limit, last, order, sort, filter })
        } catch(e) {
                console.log(e)
                return []
        }
}

const ballot_read = async function({ proposal_id, jwt }) {
	try {
		return await api_client.ballot_my_read({ proposal_id, jwt })
	} catch(e) {
		console.log(e)
		return {}
	}
}

const ballot_create = async function({ jwt, proposal_id, ballot_approved, ballot_comments }) {
	try {
		return await api_client.ballot_create({ jwt, proposal_id, ballot_approved, ballot_comments })
	} catch(e) {
		console.log(e)
		return {}
	}
}

const ballot_update = async function({ jwt, proposal_id, ballot_approved, ballot_comments }) {
	try {
		return await api_client.ballot_update({ jwt, proposal_id, ballot_approved, ballot_comments }) 
	} catch(e) {
		console.log(e)
		return {}
	}
}

const ballot_delete = async function({ jwt, proposal_id }) {
	try {
		return await api_client.ballot_delete({ jwt, proposal_id }) 
	} catch(e) {
		console.log(e)
		return {}
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

const membership_list = async function({ jwt, limit, last, order, sort, filter }) {
	try {
		return await api_client.membership_list({ jwt, limit, last, order, sort, filter})
	} catch (e) {
                console.log(e)
                return[]
        }
}

const membership_read = async function({ jwt, membership_id }) {
	try {
		return await api_client.membership_read({ jwt, membership_id })
	} catch(e) {
	        console.log(e)
		return {}
	}

}

const membership_create = async function({ jwt, profile_id, democracy_id }) {
	try {
		return await api_client.membership_create({ jwt, profile_id, democracy_id })
	} catch(e) {
		console.log(e)
		return {}
	}
}

const membership_delete = async function({ jwt, membership_id }) {
	try {
		return await api_client.membership_delete({ jwt, membership_id })
	} catch(e) {
		console.log(e)
		return {}
	}
}

const sign_in_one = async function({ email, password }) {

        // generate pake keys
        const { public: public_key, private: private_key } = auth.pake_client_generate_keys()

        // initialize signin
//        const { salt, key: server_key } = await server.sign_in_init({ email, key: public_key })
	let resp = await fetch('https://localhost:3004/v1/signin', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
			key: public_key
		})
	})
	const { salt, key: server_key } = await resp.json()

        // calculate session and proof
        const client_sesh = auth.pake_client_derive_proof(salt, email, password, private_key, server_key)

        // send proof to server
//        const { server_proof, encrypted_question, encrypted_profile } = await server.sign_in_verify({ email, key: client_sesh.proof })
	
	resp = await fetch('https://localhost:3004/v1/signin/verify', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
			key: client_sesh.proof
		})
	})
	const { server_proof, encrypted_question, encrypted_profile } = await resp.json()

        // verify server proof
        auth.pake_client_verify_proof(public_key, client_sesh, server_proof)

        // decrypt question
        const { key: pass_key } = await auth.key_password(password, salt)
        const question = await auth.decrypt(encrypted_question, pass_key)

        return { question, salt, encrypted_profile }
}

/*
const client_sign_in_two = async function({ answer, salt, encrypted_profile }) {

        // decrypt profile id
        const { key } = await auth.key_password(answer, salt)

        // return profile id
        return await auth.decrypt(encrypted_profile, key)
}
*/

export default {
	democracy_defn,
	democracy_list,
	democracy_read,
	proposal_defn,
	proposal_list,
	proposal_read,
	proposal_create,
	proposal_delete,
	ballot_defn,
	ballot_list,
	ballot_read,
	ballot_create,
	ballot_update,
	ballot_delete,
	membership_defn,
	membership_list,
	membership_read,
	membership_create,
	membership_delete,
	membership_defn,
	sign_in_one,
}
