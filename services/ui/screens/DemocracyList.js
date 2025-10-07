import { View } from 'react-native';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/';
import { TableView } from '../components/';
import api_client from './api_client';

export default function DemocracyListScreen({ route }) {
	const navigation = useNavigation();
	const { authState } = useContext(AuthContext)

	let filters = {}
	if(!!authState.state && !!route.params && 'my' in route.params) {
		filters.mine = true
	}

	const handleData = async function(q) {
		const query = q.query
		let {mine, ...filter} = !!query && !!query.filter ? query.filter : {}
		if(!!mine) {
			filter.democracy_id = {
				op: 'IN',
				val: Object.keys(authState.memberships)
			}
		}
		return await api_client.democracy_list({
			limit: query.limit,
			last: query.last, 
			order: query.order,
			sort: query.sort,
			filter
		})
	}

	return TableView({
		title:'List Democracies',
		idField: 'democracy_id',
		sortCols: ['democracy_name','democracy_population_verified','democracy_population_unverified','date_created','date_updated'],
		displayCols: ['democracy_name','democracy_description','democracy_population_verified','democracy_population_unverified','democracy_parent','date_created','date_updated'],
		filterCols: ['democracy_name','democracy_description','democracy_population_verified','democracy_population_unverified','date_created','date_updated','democracy_parent','democracy_conduct','democracy_metas','democracy_content'],
		rowPress: function(item){
			navigation.navigate('DemocracyView', {id: item.democracy_id })
		},
		filters,
		colDefns: api_client.democracy_defn,
		getData: (q) => handleData(q)
	})
}
