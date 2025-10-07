import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/';
import { ConfirmView } from '../components/'
import api_client from './api_client'

export default function MembershipDeleteScreen({ route }) {

	const democracyId = route.params.id;
	const navigation = useNavigation();

	const { authState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}
	const membershipId = authState.memberships[democracyId]

	const handleProceed = async function() {
		await api_client.membership_delete({
			jwt: authState.jwt,
			membership_id: membershipId
		})
		return {}
	}

	return ConfirmView({
		question: 'Would you like to leave this democracy?',
		proceed: handleProceed,
		nextScreen: 'MembershipList'
	})
}
