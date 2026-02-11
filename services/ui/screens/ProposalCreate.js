import { useContext, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { FormView } from '../components/'
import { AuthContext, FormContext } from '../contexts/'
import config from './config'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function ProposalCreateScreen({ route }) {

	const navigation = useNavigation();
	const democracyId = route.params.democracy;

	// redirect if not logged in
	const { authState } = useContext(AuthContext);
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	// manages member access
	const fetchMember = async() => {
		const membership_id = authState.memberships[democracyId]

		// redirect if not member
		if(!membership_id) {
			return navigation.replace('MembershipCreate', {
				id: democracyId
			})
		}

		const mem = await api.membership_read({
			membership_id: authState.memberships[democracyId],
			jwt: authState.jwt
		})
		
		// redirect if not verified
		if(!mem.is_verified) {
			return navigation.replace('MembershipVerify', {
				id: mem.membership_id
			})
		}

		// redirect if in timeout
		if(!!mem.in_timeout) {
			return navigation.replace('TimeOut', {
				id: mem.democracy_id.id,
				end: mem.timeout_end
			})
		}
	}

	// manages form values
	const { value, setValue } = useContext(FormContext)
	useEffect(() => {
		fetchMember()
		setValue({ id: democracyId })
	}, [])

	// handle form submission
	const handleProceed = async function({ proposal_name, proposal_description, proposal_target, proposal_changes }) {
		try {
			let p = {
				jwt: authState.jwt, 
				democracy_id: democracyId,
				proposal_name,
				proposal_description,
				proposal_target,
				proposal_changes: proposal_changes[proposal_target]
			}
			// TODO: something better
			if(proposal_target == 'democracy_name' || proposal_target == 'democracy_description') { 
				p.proposal_changes = proposal_changes
			}
			const prop = await api.proposal_create(p)
			return { id: prop.proposal_id, democracy: prop.democracy_id }
		} catch (e) {
			throw e
		}
	}

	// render form
	return (<FormView
		 title={'Create Proposal'}
		 formFields={['proposal_name','proposal_description','proposal_target','proposal_changes']}
		 reqFields={['proposal_name','proposal_description','proposal_target','proposal_changes']}
		 nextScreen={'ProposalView'}
		 proceed={handleProceed}
		 fields={config.defn.proposal}
		/>)
}
