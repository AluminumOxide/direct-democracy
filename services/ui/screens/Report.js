import { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext, FormContext } from '../contexts/'
import { FormView } from '../components/'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function ReportMisconductScreen({ route }) {

	const text = route.params.text
	const target = route.params.target
	const id = route.params.id
	const keys = route.params.keys
	const democracy = route.params.democracy
	const navigation = useNavigation();

	const { authState, setAuthState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	const displayText = {
		democracy_name: "the democracy's name",
		democracy_description: "the democracy's description",
		democracy_conduct: "the democracy's code of conduct",
		democracy_content: "the democracy's content",
		proposal_name: "the proposal's name",
		proposal_description: "the proposal's description",
		proposal_changes: "the proposal's changes",
		ballot_comments: "the ballot's comment"
	}

	// manages form values
	const { data, setData } = useContext(FormContext)
	const fetchData = async() => {
		let dem = await api.democracy_read({ democracy_id: democracy })
		let coc = dem.democracy_conduct.map(c => ({
			id: Object.keys(c)[0],
			name: c[Object.keys(c)[0]].description,
			dem: c[Object.keys(c)[0]].democracy_id
		})).map(t => ({
			id: [t.dem, t.id],
			name: t.id+': '+t.name
		}))
		setData({ misconduct: coc })
	}
	useEffect(() => { fetchData() }, [])

	const handleProceed = async function({ misconduct, description }) {
		const prop = await api.report_create({
			democracy_id: misconduct[0],
			misconduct_id: misconduct[1],
			misconduct_description: description,
			target_type: target,
			target_id: id,
			target_text: text.split('_')[1],
			target_keys: keys,
			jwt: authState.jwt
		})
		return { id: prop.proposal_id, democracy: prop.democracy_id }
	}

	return FormView({
		title: 'Report Misconduct',
		formFields: ['misconduct','description'],
		reqFields: ['description','misconduct'],
		nextScreen: 'ProposalView',
		proceed: handleProceed,
		fields: {
			misconduct: {
				title: `Select the first code of conduct violated by ${displayText[text]}`,
				format: 'enum'
			},
			description: {
				title: `How is ${displayText[text]} violating the code of conduct? (Answer is publicly available)`,
				format: 'multiline'
			}
		}
	})
}
