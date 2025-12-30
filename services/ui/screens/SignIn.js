import { useContext } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Form, PageContainer } from '../components/'
import { AuthContext } from '../contexts/';
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function SignInScreen() {

	const navigation = useNavigation();

	const { setAuthState } = useContext(AuthContext)

	const handleProceed = async function({ jwt }) {
		
		const { profile_id: profile } = await api.verify_jwt({ jwt })

		const mems = await api.membership_list({ jwt })
		const root = await api.democracy_root()

		let memberships = {}
		mems.map((m) => memberships[m.democracy_id.id] = m.membership_id)

		setAuthState({
			state: true,
			jwt,
			profile,
			root: root.democracy_id,
			memberships
		});

		return navigation.navigate('Account')
	}

	return (<PageContainer
		 title={'Sign In'}
		 contents={
			<View style={{flexDirection:'row', justifyContent:'center', padding:20}}>
			<View style={{flexDirection:'column'}}>
			<Text variant='bodyLarge'>To get a JWT, please run the following in a terminal:</Text>
			<View style={{backgroundColor: 'black', padding: 10}}>
			<Text style={{color: 'white', fontFamily:'monospace'}}>npm install -g @aluminumoxide/direct-democracy-authorizer</Text>
			<Text style={{color: 'white', fontFamily:'monospace'}}>direct-democracy-authorizer</Text>
			</View>
			<Form
		 	 formFields={['jwt']}
		 	 reqFields={['jwt']}
		 	 submit={handleProceed}
		 	 fields={{
		 	         jwt: {
		 	        	 title: 'JWT',
		 	        	 format: 'string'
		 	         }
		 	 }}/>
			 </View>
			 </View>
		 }
		/>)
}
