import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/';
import { DetailView } from '../components/'
import api_client from './api_client'

export default function ProposalViewScreen({ route }) {

	const navigation = useNavigation();
	const { authState } = useContext(AuthContext);

	const proposalId = route.params.id;
	const democracyId = route.params.democracy;

	const [ actions, setActions ] = useState([{
		title: "View Proposal Results",
		press: () => navigation.navigate('ProposalResult', { id: proposalId })
	}])
	
	const handleData = async function() {
		let prop = await api_client.proposal_read({ proposal_id: proposalId })
		prop.vote = false
		prop.voted = false
		prop.mine = false
		if(!!authState.state) {
			prop.vote = !!prop.proposal_votable && (Object.keys(authState.memberships).indexOf(prop.democracy_id.id) >= 0)
                        prop.mine = (Object.values(authState.memberships).indexOf(prop.membership_id) >= 0)
			let bal = await api_client.ballot_read({
				proposal_id: proposalId,
				jwt: authState.jwt 
			})
			if(Object.keys(bal).length > 0) {
				prop.voted = true
			}
		}
		if(!!prop.mine) {
			actions.push({
			      title: "Delete Proposal",
			      press: () => navigation.navigate('ProposalDelete', {
				      id: proposalId
			      })
			})
		}
		if(!!prop.vote && !!prop.voted) {
                	actions.push({
                	      title: "My Ballot",
                	      press: () => navigation.navigate('BallotView', {
				      id: proposalId
			      })
                	})
		} else if(!!prop.vote) {
			actions.push({
				title: "Vote!",
				press: () => navigation.navigate('BallotCreate', {
					id: proposalId
				})
			})
		}

		return prop
	}

	return DetailView({
		nameField: 'proposal_name',
		shortFields: ['proposal_target','proposal_votable','proposal_passed','democracy_id','date_created','date_updated'],
		longFields: ['proposal_description','proposal_changes'],
		actions,
		colDefns: api_client.proposal_defn,
		getData: handleData
	})

}
