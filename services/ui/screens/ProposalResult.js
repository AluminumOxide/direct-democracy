import { View } from 'react-native'
import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../contexts/'
import { ResultView } from '../components/'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function ProposalResultScreen({ route }) {

	const proposalId = route.params.id

	const navigation = useNavigation()
	const { authState } = useContext(AuthContext)

	const handleData = async function() {
		const prop = await api.proposal_read({ proposal_id: proposalId }) 
		let data = prop.proposal_votes
		data.democracy = prop.democracy_id.id
		data.total = {}
		data.total.yes = data.verified.yes + data.unverified.yes
		data.total.no = data.verified.no + data.unverified.no
		const yes = await api.ballot_list({ proposal_id: proposalId, ballot_approved: 'yes' })
		const no = await api.ballot_list({ proposal_id: proposalId, ballot_approved: 'no' })
		data.comments = { yes, no }
		return data
	}

	return ResultView({
		title: 'Proposal Results',
		getData: handleData,
	})
}
