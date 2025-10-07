import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../contexts/'
import { ConfirmView } from '../components/'
import api_client from './api_client'

export default function BallotDeleteScreen({ route }) {

	const proposalId = route.params.id;
	const navigation = useNavigation();

	const { authState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	const handleProceed = async function() {
		await api_client.ballot_delete({
			jwt: authState.jwt,
			proposal_id: proposalId
		})
		return { id: proposalId }
	}

	return ConfirmView({
		question: 'Would you like to delete this ballot?',
		proceed: handleProceed,
		nextScreen: 'ProposalView'
	})
}
