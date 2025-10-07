import { useContext } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { PageContainer } from '../components/'
import { AuthContext } from '../contexts/';

export default function SignUpScreen() {

	const navigation = useNavigation();

	const { setAuthState } = useContext(AuthContext)

	// TODO: temporary script sign up
	return (<PageContainer title='Sign Up' contents={(<View style={{flexDirection:'row', justifyContent:'center', padding:20}}>
		<View style={{flexDirection:'column'}}>
		<Text variant='bodyLarge'>To sign up, please run the following in a terminal:</Text>
		<View style={{backgroundColor: 'black', padding: 10}}>
		<Text style={{color: 'white', fontFamily:'monospace'}}>npm install -g @aluminumoxide/direct-democracy-authorizer</Text>
		<Text style={{color: 'white', fontFamily:'monospace'}}>direct-democracy-authorizer</Text>
		</View>
		</View>
		</View>)}/>);
}
