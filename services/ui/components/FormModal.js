import { Modal, Portal, Text } from 'react-native-paper'
import { View } from 'react-native'
import getStyles from './styles'
import { Form } from '.'

export default function FormModal({ title, formFields, reqFields, fields, keys=[], getVisibility, submit, cancel }) {
	const styles = getStyles()
	return (<Portal>
		<Modal
		 visible={getVisibility()}
		 contentContainerStyle={styles.pageModal}
		 onDismiss={cancel}>
			<Text
			 variant={styles.pageModalTitle.variant}
			 style={styles.pageModalTitle}>
				{title}
			</Text>
			{Form({
				formFields,
				reqFields,
				fields,
				keys,
				submit,
				cancel
			})}
		</Modal>
	</Portal>)
}
