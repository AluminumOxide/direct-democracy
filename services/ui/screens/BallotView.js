import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/';
import { DetailView } from '../components/'
import api_client from './api_client'

export default function BallotViewScreen({ route }) {

	const proposalId = route.params.id;
	const navigation = useNavigation();

	const { authState } = useContext(AuthContext);
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	const [ actions, setActions ] = useState([])


	const handleData = async function() {
		const ballot = await api_client.ballot_read({
			proposal_id: proposalId,
			jwt: authState.jwt
		})
		if(!!ballot.ballot_modifiable) {
			setActions([{
				title: "Update Ballot",
				press: () => navigation.navigate('BallotUpdate', {id: proposalId})
			},{
				title: "Delete Ballot",
				press: () => navigation.navigate('BallotDelete', {id: proposalId})
			}])
		}
		return ballot
	}

	return DetailView({
		nameField: 'proposal_id',
		shortFields: ['ballot_approved','date_created','date_updated'],
		longFields: ['ballot_comments'],
		actions: actions,
		colDefns: api_client.ballot_defn,
		getData: handleData 
	})
}
