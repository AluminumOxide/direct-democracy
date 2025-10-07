import { useContext } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/'
import { PageContainer } from '../components/'
import getStyles from '../components/styles'

export default function AccountScreen() {

	const styles = getStyles()
	const navigation = useNavigation();
	
	const { authState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	return (<PageContainer title='My Account' contents={(
		<View style={styles.accountContainer}>
			<Button
			 style={styles.accountButton}
			 labelStyle={styles.accountButtonText}
			 mode={styles.accountButton.mode}
			 onPress={() => navigation.navigate('MembershipList')}>
				My Memberships
			</Button>
			<Button
			 style={styles.accountButton}
			 labelStyle={styles.accountButtonText}
			 mode={styles.accountButton.mode}
			 onPress={() => navigation.navigate('DemocracyList',{'my':true})} >
				My Democracies
			</Button>
			<Button
			 style={styles.accountButton}
			 labelStyle={styles.accountButtonText}
			 mode={styles.accountButton.mode}
			 onPress={() => navigation.navigate('ProposalList',{'my':true})}>
				My Proposals
			</Button>
			<Button
			 style={styles.accountButton}
			 labelStyle={styles.accountButtonText}
			 mode={styles.accountButton.mode}
			 onPress={() => navigation.navigate('BallotList')}>
				My Ballots
			</Button>
		</View>
	)}/>);
}
