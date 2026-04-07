import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import getStyles from './styles'
import { useContext } from 'react'
import { FormContext } from '../contexts'
import { jsonChanges } from '../utils/'

export default function FieldInputSelect({keys, val, setVal}) {
	const { data, setData } = useContext(FormContext)
	const styles = getStyles()
	return (<View style={styles.fieldSelectContainer}>
		{Array.isArray(jsonChanges.objGet(data, keys)) && jsonChanges.objGet(data, keys).map(opt => (
			<Text
			 key={opt.id}
			 style={opt.id==val ? styles.fieldSelectSelected : styles.fieldSelectUnselected}
			 onPress={() => setVal(opt.id)}>
				{opt.name}
			</Text>
		))}
	</View>)}
