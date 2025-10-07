import { useContext } from 'react';
import { ConfirmView } from '../components/'
import { AuthContext } from '../contexts/';

export default function SignOutScreen() {

	const { setAuthState } = useContext(AuthContext)

	return ConfirmView({
		question: 'Would you like to log out?',
		proceed: () => setAuthState({state:false,jwt:null,profile:null,memberships:{}}),
		nextScreen: 'SignIn'
	})
}
