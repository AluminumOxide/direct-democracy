import { View } from 'react-native'
import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../contexts/'
import { ResultView } from '../components/'
import api_client from './api_client'

export default function ProposalResultScreen({ route }) {

	const proposalId = route.params.id

	const navigation = useNavigation()
	const { authState } = useContext(AuthContext)

	const handleData = async function() {
		return (await api_client.proposal_read({ proposal_id: proposalId })).proposal_votes
	}

	return ResultView({
		title: 'Proposal Results',
		getData: handleData,
	})
}
