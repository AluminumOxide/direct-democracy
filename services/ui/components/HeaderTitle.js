import { View } from 'react-native';
import { Text } from 'react-native-paper';
import getStyles from './styles';

export default function HeaderTitle({ }) {
	const styles = getStyles()
	return (<View style={styles.headerTitleContainer}>
		<Text
		 style={styles.headerTitleText}
		 variant={styles.headerTitleText.variant}>
			Direct-Democracy
		</Text>
	</View>);
}
