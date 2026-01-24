import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext, FormContext } from '../contexts/'
import { FormView } from '../components/'
const api = require('@aluminumoxide/direct-democracy-external-api-client')

export default function MembershipVerifyScreen({ route }) {

	const membershipId = route.params.id;
	const navigation = useNavigation();

	const { authState, setAuthState } = useContext(AuthContext)
	if(!authState.state) {
		return navigation.navigate('SignIn')
	}

	const handleProceed = async function({ description }) {
		const prop = await api.membership_verify({
			description,
			membership_id: membershipId,
			jwt: authState.jwt
		})
		return { id: prop.proposal_id }
	}

	return (<FormView
		 title={'Membership Verification Request'}
		 formFields={['description']}
		 reqFields={[]}
		 nextScreen={'ProposalView'}
		 proceed={handleProceed}
		 fields={{
			description: {
				title: 'Why should your membership be verified? (Answer is publicly available)',
				format: 'multiline'
			}
		 }}
		/>)
}
