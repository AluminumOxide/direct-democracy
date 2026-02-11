import { useContext, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext, FormContext } from '../contexts/'
import { FormView } from '../components/'
import config from './config'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function BallotCreateScreen({ route }) {
	
	const navigation = useNavigation();	
	const proposalId = route.params.id;

	// redirect if not logged in
	const { authState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}
	
	// manages member access
	const fetchMember = async() => {
		const prop = await api.proposal_read({
			proposal_id: proposalId
		})
		const membership_id = authState.memberships[prop.democracy_id.id]

		// redirect if not member
		if(!membership_id) {
			return navigation.replace('MembershipCreate', {
				id: prop.democracy_id.id,
			})
		}
		
		// redirect if in timeout
		const mem = await api.membership_read({
			membership_id,
			jwt: authState.jwt
		})
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
		setValue({ proposal_id: proposalId })
	}, [])

	// handle form submission
	const handleProceed = async function(val) {
		const bal = await api.ballot_create({
			jwt: authState.jwt,
			proposal_id: proposalId,
			...val})
		return { id: proposalId }
	}

	// render form
	return FormView({
		title: 'Cast Ballot',
		formFields: ['ballot_approved','ballot_comments'],
		nextScreen: 'BallotView',
		proceed: handleProceed,
		fields: config.defn.ballot
	})
}
