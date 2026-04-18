import { useContext, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../contexts/'
import { ConfirmView } from '../components/'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function MembershipCreateScreen({ route }) {

	const democracyId = route.params.id;
	const navigation = useNavigation();

	const { authState, setAuthState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	const [ data, setData ] = useState([])
	const fetchData = async() => {
		const dem = await api.democracy_read({ democracy_id: democracyId })
		let question = `Would you like to join "${dem.democracy_name}"?`
		let conduct = `By joining "${dem.democracy_name}" you are agreeing to follow the code of conduct:\n\n`
		dem.democracy_conduct.map(c => {
			let k = Object.keys(c)[0]
			conduct += `☑︎ ${k}: ${c[k].description}\n`
		})
		setData({
			question,
			conduct
		})
	}
	useEffect(() => { fetchData() }, [])

	const handleProceed = async function() {
		const mem = await api.membership_create({
			jwt: authState.jwt,
			profile_id: authState.profile, 
			democracy_id: democracyId
		})
		setAuthState({
			...authState,
			memberships: {
				...authState.memberships,
				[mem.democracy_id]: mem.membership_id
			}
		})
	}

	return ConfirmView({
		question: data.question,
		confirmText: data.conduct,
		proceed: handleProceed,
		nextScreen: 'MembershipList'
	})
}
