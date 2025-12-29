import { useContext, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext, FormContext } from '../contexts/'
import { FormView } from '../components/'
import config from './config'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function BallotCreateScreen({ route }) {

	// redirect if not logged in
	const navigation = useNavigation();	
	const { authState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	// manages form values
	const proposalId = route.params.id;
	const { value, setValue } = useContext(FormContext)
	useEffect(() => {
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
