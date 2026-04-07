import { useContext } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/';
import { DetailView } from '../components/';
import config from './config'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function DemocracyViewScreen({ route }) {

	const navigation = useNavigation();
	const democracyId = route.params.id;

	const { authState } = useContext(AuthContext);
	let actions = [{
		title: "List Democracy's Proposals",
		press: () => navigation.navigate('ProposalList', { democracy: democracyId })
	}]
	if(!!authState.state) {
		if(democracyId in authState.memberships) {
			actions.push({
				title:'Create a Proposal',
				press: () => navigation.navigate('ProposalCreate', { democracy: democracyId })
			})
			actions.push({
				title:'Create a Democracy',
				press: () => navigation.navigate('DemocracyCreate', { democracy: democracyId })
			})
			if(democracyId != authState.root) {
				actions.push({
					title:'Leave Democracy',
					press: () => navigation.navigate('MembershipDelete', { id: democracyId })
				})
			}
		} else {
			if(democracyId != authState.root) {
				actions.push({
					title:'Join Democracy',
					press: () => navigation.navigate('MembershipCreate', { id: democracyId })
				})
			}
		}
	}

	const getData = async function() {
		let dem = await api.democracy_read({democracy_id: democracyId})
		dem.democracy_conduct = dem.democracy_conduct.filter(d => d[Object.keys(d)[0]].democracy_id === democracyId)
			.map(d => {return {[Object.keys(d)[0]] : d[Object.keys(d)[0]].description}})
		return dem
	}

	return DetailView({
		id: democracyId,
		democracy: democracyId,
		target: 'democracy',
		nameField: 'democracy_name',
		shortFields: ['democracy_population_verified','democracy_population_unverified','date_created','date_updated','democracy_parent'],
		longFields: ['democracy_description','democracy_children','democracy_conduct','democracy_content','democracy_metas'],
		reportFields: ['democracy_name','democracy_description','democracy_conduct','democracy_content'],
		actions: actions,
		getData,
		colDefns: config.defn.democracy 
	})
}
