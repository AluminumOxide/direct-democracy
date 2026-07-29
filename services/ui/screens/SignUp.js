import { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FormView } from '../components/'
import { AuthContext, FormContext } from '../contexts/';
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function SignUpScreen() {

	const navigation = useNavigation();
	const { setAuthState } = useContext(AuthContext)
	const { defns, setDefns, setValue } = useContext(FormContext)
	const [ signUp, setSignUp ] = useState({})

	useEffect(() => {
		setDefns({
			email: {
				title: 'Email',
				format: 'string'
			},
			password: {
				title: 'Password',
				format: 'string'
			},
			question: {
				title: 'Security Question',
				format: 'string'
			},
			answer: {
				title: 'Security Question Answer',
				format: 'string'
			},
			token: {
				title: 'Emailed Token',
				format: 'string',
				visible: false
			}
		})
	}, [])

	const handleProceed = async function(vals) {
		if(!vals.token) {
			// first sign up step
			const { email, password, question, answer } = vals
			const { salt } = await api.sign_up_one({ email, password, question })
			setSignUp({ answer, salt })

			// show email token field
			let copy = Object.assign({}, defns)
			copy.token.visible = true
			setDefns(copy)
			return false
		}

		// continue sign up
		const { token: email_token } = vals
		const profile_token = await api.sign_up_two({ email_token })
		const { answer, salt } = signUp
		const { profile_id, signup_token } = await api.sign_up_three({ answer, profile_token })
		const account_token = await api.sign_up_four({ signup_token })
		await api.sign_up_five({ answer, salt, profile_id, email_token, account_token })
		setValue({})
		return {}
	}

	return (<FormView
		 title={'Sign Up'}
		 proceed={handleProceed}
		 nextScreen={'SignIn'}
		 formFields={['email','password','question','answer','token']}
		 reqFields={['email','password','question','answer']}
		 fields={{}}/>)
}
