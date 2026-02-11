import { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext, FormContext } from '../contexts/'
import { FormView } from '../components/'
import config from './config'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function BallotUpdateScreen({ route }) {

	const proposalId = route.params.id
	const navigation = useNavigation();
	
	// redirect if not logged in
	const { authState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	// redirect if in timeout
	const fetchMember = async() => {
		const prop = await api.proposal_read({
			proposal_id: proposalId
		})
		const mem = await api.membership_read({
			membership_id: authState.memberships[prop.democracy_id.id],
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
		if(Object.keys(value).length === 0) {
			(async function() {
				const bal = await api.ballot_my_read({
					proposal_id: proposalId,
					jwt: authState.jwt
				})
				setValue({
					proposal_id: proposalId,
					ballot_approved: bal.ballot_approved,
					ballot_comments: bal.ballot_comments
				})
			})()
		}
	}, [])

	// handle form submission
	const handleProceed = async function() {
		const bal = await api.ballot_update({
			jwt: authState.jwt, 
			...value })
		return { id: proposalId }
	}

	// render form
	return FormView({
		title: 'Update Ballot',
		formFields: ['ballot_approved','ballot_comments'],
		nextScreen: 'BallotView',
		fields: config.defn.ballot, 
		proceed: handleProceed
	})
}
