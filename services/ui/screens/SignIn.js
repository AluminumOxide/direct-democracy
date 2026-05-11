import { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FormView } from '../components/'
import { AuthContext, FormContext } from '../contexts/';
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function SignInScreen() {

	const navigation = useNavigation();
	const { setAuthState } = useContext(AuthContext)
	const { defns, setDefns, setValue } = useContext(FormContext)
	const [ signIn, setSignIn ] = useState({})

	useEffect(() => {
		setValue({ email: false, password: false})
		setDefns({
			email: {
				title: 'Email',
				format: 'string'
			},
			password: {
				title: 'Password',
				format: 'string'
			},
			answer: {
				title: 'TODO',
				format: 'string',
				visible: false
			}
		})
	}, [])

	const handleProceed = async function(vals) {

		// first sign in step
		if(!vals.answer) {
			const { email, password } = vals
			const { question, salt, encrypted_profile } = await api.sign_in_one({ email, password })
			setSignIn({ salt, encrypted_profile })
			let copy = Object.assign({}, defns)
			copy.answer.title = question
			copy.answer.visible = true
			setDefns(copy)
			return false
		}

		// continue sign in
		const { answer } = vals
		const { salt, encrypted_profile } = signIn
		const profile_id = await api.sign_in_two({ answer, salt, encrypted_profile })
		const { jwt } = await api.sign_in_three({ profile_id, answer })
		const mems = await api.membership_list({ jwt })
		const root = await api.democracy_root()

		let memberships = {}
		mems.map((m) => memberships[m.democracy_id.id] = m.membership_id)

		setAuthState({
			state: true,
			jwt,
			profile: profile_id,
			root: root.democracy_id,
			memberships
		});

		return {}
	}

	return(<FormView
		title={'Sign In'}
		proceed={handleProceed}
		nextScreen={'Account'}
		formFields={['email','password','answer']}
		reqFields={['email','password']}
		fields={{}}/>)
}
