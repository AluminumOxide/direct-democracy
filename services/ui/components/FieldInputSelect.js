import { View } from 'react-native'
import { Button } from 'react-native-paper'
import getStyles from './styles'
import { useContext } from 'react'
import { FormContext } from '../contexts'
import { jsonChanges } from '../utils/'

export default function FieldInputSelect({keys, val, setVal}) {
	const { data, setData } = useContext(FormContext)
	const styles = getStyles()
	return (<View style={styles.fieldSelectContainer}>
		{Object.keys(jsonChanges.objGet(data, keys)).map(opt => (
			<Button
			 key={opt}
			 mode={opt==val ? styles.fieldSelectSelected.mode : styles.fieldSelectUnselected.mode}
			 style={opt==val ? styles.fieldSelectSelected : styles.fieldSelectUnselected}
			 labelStyle={styles.fieldSelectLabel}
			 onPress={() => setVal(opt)}>
				{jsonChanges.objGet(data, keys.concat(opt))}
			</Button>
		))}
	</View>)}
