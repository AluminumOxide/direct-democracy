import { View } from 'react-native'
import { Text } from 'react-native-paper'
import { Paragraph, FieldValue } from '.'
// TODO: why can't I import styles here normally? ...recursion?

export default function FieldRow({ label, data, format, layout, opts={}, styles }) {

	if(format == 'object' || format =='array' || (format === 'multiline' && layout != 'short')) {
		return Paragraph({
			title: label,
			contents: (<FieldValue data={data} format={format} layout={layout} opts={opts} styles={styles} />)
		})
		
	} else {
		return (<View style={styles.fieldValueContainer}>
			<Text style={styles.fieldValueLabel}>{label}: </Text>
			<FieldValue data={data} format={format} layout={layout} opts={opts} styles={styles} />
		</View>)
	}
}
