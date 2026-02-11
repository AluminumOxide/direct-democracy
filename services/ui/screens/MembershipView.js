import { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/';
import { DetailView } from '../components/';
import config from './config';
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function MembershipViewScreen({ route }) {

	const democracyId = route.params.id;
	const navigation = useNavigation();
	
	const { authState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}
	const membershipId = authState.memberships[democracyId]

	const [ actions, setActions ] = useState([])

	const handleData = async function() {
		if(democracyId != authState.root) {
			actions.push({
				title: 'Leave Democracy',
				press: () => navigation.navigate('MembershipDelete', { id: democracyId })
			})
		}
		let mem = await api.membership_read({
			membership_id: membershipId,
			jwt: authState.jwt 
		})
		mem.status = !!mem.is_verified ? 'Verified' : !!mem.is_verifying ? 'Verifying' : 'Unverified'
		mem.timeout_history = !mem.timeout_history ? [] : Object.keys(mem.timeout_history).map(m => ({ id: mem.timeout_history[m], name: m }))
		if(mem.status === 'Unverified') {
			actions.push({
				title: 'Request Membership Verification',
				press: () => navigation.navigate('MembershipVerify', { id: membershipId })
			})
		}
		if(mem.status === 'Verifying') {
			actions.push({
				title: 'View Membership Verification Request',
				press: () => navigation.navigate('ProposalView', { id: mem.verify_proposal })
			})
		}
		return mem
	}

	return DetailView({
		nameField: 'democracy_id',
		shortFields: ['democracy_id','status','in_timeout','timeout_end','date_created','date_updated'],
		longFields: ['timeout_history'],
		actions,
		colDefns: config.defn.membership,
		getData: handleData
	})
}
