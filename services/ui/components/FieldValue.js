import { FlatList, View } from 'react-native'
import { Link, useNavigation } from '@react-navigation/native'
import { Checkbox, Text } from 'react-native-paper'
import { Paragraph } from '.'
// TODO: why can't I import styles here normally? ...recursion?

export default function FieldValue({ data, format, layout, opts={}, styles, textStyle={} }) {

	const navigation = useNavigation()

	if(format === 'boolean') {
		return(<Checkbox
			 status={!!data ? 'checked' : 'unchecked'}
			 disabled={true}/>)
	
	} else if(format === 'date') {
		return(<Text style={styles.fieldValueText}>{!!data ? (new Date(data)).toLocaleDateString("en-CA", {
			month:'long',
			day:'numeric',
			year:'numeric'
		}) : 'Never'}</Text>)
			
	} else if(format === 'uuid') {
		const handleLink = async function() {
			if(!!opts && !!data) { // TODO: fix - this makes react angry
				navigation.push(opts.link, {id: data.id})
			}
		}
		return(<Text onPress={handleLink} style={{...textStyle, ...styles.fieldValueText, ...styles.linkText}}>
				{!!data?data.name:data}
			</Text>)

	} else if(format === 'array') {
		return (<FlatList 
			data={data}
			renderItem={({item}) => (<View style={styles.fieldValueContainer}>
				<Text style={styles.fieldValueText}>• </Text>
				<FieldValue
					data={item}
					format={!!opts && !!opts.format ? opts.format : 'string'}
					opts={opts}
					styles={styles} />
			</View>)}	
		/>)
	
	} else if(format === 'object') {
		return (<FlatList
			 data={!!data ? Object.keys(data) : []}
			 renderItem={({item}) => (
				<Paragraph
				 title={item}
				 contents={
					<FieldValue
					 data={data[item]}
					 format={Array.isArray(data[item]) ? 'array' : typeof data[item] == 'object' ? 'object' : 'string'}
					 styles={styles}/>}
				 />)}
			/>)

	// string, multiline, integer, enum
	} else {
		return(<Text style={{...textStyle, ...styles.fieldValueText }}>{data}</Text>)
	}
}
