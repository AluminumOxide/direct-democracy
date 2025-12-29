import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../contexts/'
import { ConfirmView } from '../components/'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function MembershipCreateScreen({ route }) {

	const democracyId = route.params.id;
	const navigation = useNavigation();

	const { authState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	const handleProceed = async function() {
		return await api.membership_create({
			jwt: authState.jwt,
			profile_id: authState.profile, 
			democracy_id: democracyId
		})
	}

	return ConfirmView({
		question: 'Would you like to join this democracy?',
		proceed: handleProceed,
		nextScreen: 'MembershipList'
	})
}
