import { useContext, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { FormView } from '../components/'
import { AuthContext, FormContext } from '../contexts/'
import api_client from './api_client'

export default function ProposalCreateScreen({ route }) {

	// redirect if not logged in
	const navigation = useNavigation();
	const { authState } = useContext(AuthContext);
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	// manages form values
	const democracyId = route.params.democracy;
	const { value, setValue } = useContext(FormContext)
	useEffect(() => {
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
			const prop = await api_client.proposal_create(p)
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
		 fields={api_client.proposal_defn}/>)
}
