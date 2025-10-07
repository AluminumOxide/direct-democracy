import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../contexts/'
import { ConfirmView } from '../components/'
import api_client from './api_client'

export default function MembershipCreateScreen({ route }) {

	const democracyId = route.params.id;
	const navigation = useNavigation();

	const { authState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	const handleProceed = async function() {
		return await api_client.membership_create({
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
