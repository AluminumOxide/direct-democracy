import { useContext, useEffect } from 'react'
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

	// redirect if in timeout
	const fetchMember = async() => {
		const prop = await api.proposal_read({
			proposal_id: proposalId
		})
		const mem = await api.membership_read({
			membership_id: authState.memberships[prop.democracy_id.id],
			jwt: authState.jwt
		})
		if(!!mem.in_timeout) {
			return navigation.replace('TimeOut', {
				id: mem.democracy_id.id,
				end: mem.timeout_end
			})
		}
	}
	useEffect(() => { fetchMember() }, [])

	const handleProceed = async function() {
		return await api.proposal_delete({
			jwt: authState.jwt, 
			proposal_id: proposalId
		})
	}

	return ConfirmView({
		question: 'Would you like to cancel this proposal?',
		proceed: handleProceed,
		nextScreen: 'ProposalList'
	})
}
