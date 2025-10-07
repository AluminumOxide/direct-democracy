import { useContext } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/';
import { DetailView } from '../components/';
import api_client from './api_client';

export default function MembershipViewScreen({ route }) {

	const democracyId = route.params.id;
	const navigation = useNavigation();
	
	const { authState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}
	const membershipId = authState.memberships[democracyId]

	const handleData = async function() {
		return await api_client.membership_read({
			membership_id: membershipId,
			jwt: authState.jwt 
		})
	}

	return DetailView({
		nameField: 'democracy_id',
		shortFields: ['democracy_id','is_verified','date_created','date_updated'],
		longFields: [],
		actions: [{
			title: 'Leave Democracy',
			press: () => navigation.navigate('MembershipDelete', { id: democracyId })
		}],
		colDefns: api_client.membership_defn,
		getData: handleData
	})
}
