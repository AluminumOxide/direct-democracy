import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../contexts/'
import { ConfirmView } from '../components/'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function ProposalDeleteScreen({ route }) {

	const proposalId = route.params.id;
	const navigation = useNavigation();

	const { authState } = useContext(AuthContext);
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	const handleProceed = async function() {
		return await api.proposal_delete({
			jwt: authState.jwt, 
			proposal_id: proposalId
		})
	}

	return ConfirmView({
		question: 'Would you like to delete this proposal?',
		proceed: handleProceed,
		nextScreen: 'ProposalList'
	})
}
