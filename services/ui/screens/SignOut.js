import { useContext } from 'react';
import { ConfirmView } from '../components/'
import { AuthContext } from '../contexts/';
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function SignOutScreen() {

	const { authState, setAuthState } = useContext(AuthContext)

	const handleProceed = async function() {
		await api.sign_out({ jwt: authState.jwt })
		setAuthState({
			state:false,
			jwt:null,
			profile:null,
			memberships:{}
		})
	}

	return ConfirmView({
		question: 'Would you like to log out?',
		proceed: () => handleProceed(),
		nextScreen: 'SignIn'
	})
}
