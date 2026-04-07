import { useNavigation } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'
import getStyles from './styles'

export default function ReportButton({ text, target, id, keys, democracy }) {
	const navigation = useNavigation();

	const styles = getStyles()
	return (<IconButton
		  icon='comment-alert'
		  size={styles.reportButton.size}
		  iconColor={styles.reportButton.color}
		  onPress={() => navigation.navigate('Report', { text, target, keys, id, democracy })}
		  style={styles.reportButton}
		/>)
}
