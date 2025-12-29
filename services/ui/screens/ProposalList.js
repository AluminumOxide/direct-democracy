import { View } from 'react-native';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/';
import { TableView } from '../components/';
import config from './config'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function ProposalListScreen({ route }) {

	const navigation = useNavigation();
	const { authState } = useContext(AuthContext)

	let filters = {}
	if(!!route.params) {
		if(!!authState.state && 'my' in route.params) {
			filters.mine = true
		}
		if('democracy' in route.params) {
			filters.democracy_id = { 'op':'=', 'val':route.params.democracy }
		}
	}

	const handleData = async function(q) {
		const query = q.query
		let {mine, ...filter} = !!query && !!query.filter ? query.filter: {}
		if(!!mine) {
			filter.democracy_id = {
				op: 'IN',
				val: Object.keys(authState.memberships)
			}
		}
		return await api.proposal_list({
			limit: query.limit,
			last: query.last,
			order: query.order,
			sort: query.sort,
			filter
		})
	}

	return TableView({
		title: 'List Proposals',
		idField: 'proposal_id',
		sortCols: ['proposal_name','proposal_target','proposal_votable','proposal_passed','date_created','date_updated'],
		displayCols: ['proposal_name','proposal_description','democracy_id','proposal_target','proposal_votable','proposal_passed','date_created','date_updated'],
		filterCols: ['proposal_name','proposal_description','democracy_id','proposal_target','proposal_changes','proposal_votable','proposal_passed','date_created','date_updated'],
		rowPress: function(item){
			navigation.navigate('ProposalView', {id: item.proposal_id })
		},
		filters,
		getData: (q) => handleData(q),
		colDefns: config.defn.proposal 
	})
}
