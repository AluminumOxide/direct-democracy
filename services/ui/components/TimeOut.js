import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'
import getStyles from './styles';

export default function TimeOut({ democracyId, end, backButton=false }) {
	const styles = getStyles()
	const navigation = useNavigation()

	const handleMemLink = async function() {
		navigation.push('MembershipView', {id: democracyId})
	}

	// render component
	return (<View style={styles.timeoutContainer}>

		<Text styles={styles.timeoutText} variant={styles.timeoutText.variant}>You are in time out!</Text>
		<View style={{flexDirection:'row'}}>
			<Text>The community have put you in time out for </Text>
			<Text onPress={handleMemLink} style={{...styles.timeoutText, ...styles.linkText}}>misconduct</Text>
			<Text>.</Text>
		</View>
		<Text>You have {Math.round((new Date(end)-new Date())/(1000*60*60*24))} days to consider how you can be a better community member.</Text>
		{!!backButton && <Button
		 icon='check'
		 onPress={() => navigation.goBack() }
		 mode={styles.timeoutButton.mode}
		 style={styles.timeoutButton}>
		  I will do better
		</Button>}

	</View>)
}
