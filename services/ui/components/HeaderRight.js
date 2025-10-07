import { useContext, useState } from 'react';
import { View } from 'react-native';
import { Button, IconButton, Menu, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/';
import getStyles from './styles';

export default function HeaderRight({ }) {

	const navigation = useNavigation();
	const styles = getStyles()

	// is user logged in?
	const { authState } = useContext(AuthContext)

	// is drop down menu visible?
	const [ displayState, setDisplayState ] = useState(false);

	// determine pages to display
	let pages = {
		'DemocracyList': 'Democracies',
		'ProposalList': 'Proposals'
	}
	if(!!authState.state) {
		pages['Account'] = 'My Account';
		pages['SignOut'] = 'Sign Out';
	} else {
		pages['SignIn'] = 'Sign In';
		pages['SignUp'] = 'Sign Up';
	}

	// render drop down
	return (<View style={styles.headerRightContainer}>
		<Menu
			visible={displayState}
			onDismiss={() => setDisplayState(false)}
			anchor={<IconButton
				icon='menu'
				size={styles.headerRightButton.size}
				iconColor={styles.headerRightButton.color}
				onPress={() => setDisplayState(!displayState)}/>}>
			{Object.entries(pages).map(([key, value]) => (<Menu.Item
				key={value}
				title={value}
				titleStyle={styles.headerRightItem}
				onPress={() => setDisplayState(false)
					|| navigation.navigate(key) }/>))}
		</Menu>
	</View>);
}
