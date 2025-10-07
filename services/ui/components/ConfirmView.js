import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { PageContainer } from './';
import getStyles from './styles';

export default function ConfirmView({question, proceed, nextScreen }) {
	
	const styles = getStyles()
	const navigation = useNavigation()

	const handleProceed = async function() {
		navigation.navigate(nextScreen, await proceed())
	}

	return PageContainer({
		title: question,
		contents: (<View style={styles.confirmContainer}>
			<Button
			 icon='check'
			 onPress={handleProceed}
			 mode={styles.confirmButtons.mode}
			 style={styles.confirmButtons}
			 labelStyle={styles.confirmButtonsText}>
				Yes
			</Button>
			<Button
			 icon='cancel'
			 onPress={() => navigation.goBack() }
			 mode={styles.confirmButtons.mode}
			 style={styles.confirmButtons}
			 labelStyle={styles.confirmButtonsText}>
				No
			</Button>
		</View>)
	})
}
