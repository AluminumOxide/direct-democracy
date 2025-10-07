import { View } from 'react-native';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/';
import { TableView } from '../components/';
import config from './config';
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function MembershipListScreen({ route }) {

	const navigation = useNavigation();

	const { authState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	const handleData = async function(q) {
		const query = q.query
		return await api.membership_list({
			jwt: authState.jwt, 
			limit: query.limit,
			last: query.last,
			order: query.order,
			sort: query.sort,
			filter: query.filter
		})
	}

	return TableView({
		title:'My Memberships', 
		idField: 'membership_id',
		sortCols: ['date_created','date_updated'],
		displayCols: ['democracy_id','is_verified','date_created','date_updated'],
		filterCols: ['democracy_id','is_verified','date_created','date_updated'],
		rowPress: function(item){
			navigation.navigate('MembershipView', {id: item.democracy_id.id })
		},
		filters: {},
		colDefns: config.defn.membership,
		getData: handleData
	})
}
