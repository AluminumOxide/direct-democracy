import { Text, View } from 'react-native';
import { Link } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { PageContainer } from '../components/'

export default function HomeScreen() {
	const navigation = useNavigation();
	return PageContainer({
		title:'Welcome!',
		contents:(<View style={{flexDirection:'row',justifyContent:'center',padding:20}}><Text>
		Some inspiring text to encourage <Link screen='DemocracyList'>browsing democracies</Link>, <Link screen='ProposalList'>reading proposals</Link> or <Link screen='SignUp'>signing up</Link>!
	</Text></View>)
	})
}
