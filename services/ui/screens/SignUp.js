import { useContext } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { PageContainer } from '../components/'
import { AuthContext } from '../contexts/';

export default function SignUpScreen() {

	const navigation = useNavigation();

	const { setAuthState } = useContext(AuthContext)

	return (<PageContainer title='Sign Up' contents={(<View>
		<Button mode='contained' style={{margin:5}} onPress={() => {
			setAuthState({state:true,jwt:'asdf',memberships:{
				'a062d797-8b6a-499c-9d8b-9a0cdf0871bf':'acd16c5f-7abe-4ce9-ac3b-a74804af1f57',
				'51a9a676-3b1e-47eb-845b-2784ccdd1d59':'ff53406b-af02-43da-bf39-a75a6752cfc2',
				'430488ba-7c63-49da-b22d-0435be67f4ef':'d882a489-9ef8-4f9e-a782-4ef2a0f91342'
			}});
			navigation.navigate('Account');
		}}> Sign Up </Button>
	</View>)}/>);
}
