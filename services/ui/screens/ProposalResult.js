import { View } from 'react-native'
import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../contexts/'
import { ResultView } from '../components/'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function ProposalResultScreen({ route }) {

	const proposalId = route.params.id

	const navigation = useNavigation()
	const { authState } = useContext(AuthContext)

	const handleData = async function() {
		return (await api.proposal_read({ proposal_id: proposalId })).proposal_votes
	}

	return ResultView({
		title: 'Proposal Results',
		getData: handleData,
	})
}
