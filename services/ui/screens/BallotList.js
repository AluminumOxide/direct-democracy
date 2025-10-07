import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/';
import { TableView } from '../components/';
import api_client from './api_client'

export default function BallotListScreen({ route }) {

	const navigation = useNavigation();
	const { authState } = useContext(AuthContext)

	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	let filters = {}
	if(!!route.params && 'proposal' in route.params) {
		filters.proposal_id = { 'op':'=', 'val':route.params.proposal }
	}

	const handleData = async function(q) {
		const query = q.query
		const filter = !!query && !!query.filter ? query.filter : {}
		return await api_client.ballot_list({
			jwt: authState.jwt,
			limit: query.limit,
			last: query.last,
			order: query.order,
			sort: query.sort,
			filter
		})
	}

	return TableView({
		title:'My Ballots',
		idField: 'ballot_id',
		sortCols: ['ballot_approved','proposal_id','ballot_verified','ballot_modifiable','date_created','date_updated'],
		displayCols: ['ballot_approved','ballot_comments','proposal_id','ballot_verified','ballot_modifiable','date_created','date_updated'],
		filterCols: ['ballot_approved','ballot_comments','proposal_id','ballot_verified','ballot_modifiable','date_created','date_updated'],
		rowPress: function(item){
			navigation.navigate('BallotView', {id: item.proposal_id.id })
		},
		filters,
		colDefns: api_client.ballot_defn,
		getData: (q) => handleData(q)
	})
}
