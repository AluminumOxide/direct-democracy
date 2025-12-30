import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/';
import { ConfirmView } from '../components/'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function MembershipDeleteScreen({ route }) {

	const democracyId = route.params.id;
	const navigation = useNavigation();

	const { authState, setAuthState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}
	const membershipId = authState.memberships[democracyId]

	const handleProceed = async function() {
		await api.membership_delete({
			jwt: authState.jwt,
			membership_id: membershipId
		})
		const { [democracyId]: oldMem, ...mems } = authState.memberships
		setAuthState({
			...authState,
			memberships: mems
		})
		return {}
	}

	return ConfirmView({
		question: 'Would you like to leave this democracy?',
		proceed: handleProceed,
		nextScreen: 'MembershipList'
	})
}
