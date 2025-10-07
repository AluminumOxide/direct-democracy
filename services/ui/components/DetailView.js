import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { PageContainer, FieldRow } from './';
import getStyles from './styles';

export default function DetailView({ nameField, shortFields, longFields, getData, colDefns, actions }) {

	// load data
	const [ data, setData ] = useState([]);
	const fetchData = async() => {
		setData(await getData());
	}
	useEffect(() => { fetchData() }, []);

	// render component
	const styles = getStyles()	
	return PageContainer({
		title: !!data[nameField]&&data[nameField].name ? data[nameField].name:data[nameField],
		contents: (<View style={styles.detailContainer}>

		{/* short details */}
		<View style={styles.detailShortContainer}>
		{shortFields.map((col) => (<FieldRow
			label={colDefns[col].title}
			data={data[col]}
			format={colDefns[col].format}
			opts={colDefns[col].opts}
			styles={styles}/>))}
		</View>

		{/* action buttons */}
		<View style={styles.detailActionContainer}>
			{actions.map((act) => (<Button
				mode={styles.detailActionButton.mode}
				onPress={act.press}
				style={styles.detailActionButton}
				labelStyle={styles.detailActionButtonText}>
					{act.title}
				</Button>))}
		</View>

		{/* long details */}
		<View style={styles.detailLongContainer}>
			{longFields.map((col) => (<FieldRow
				label={colDefns[col].title}
				data={data[col]}
				format={colDefns[col].format}
				opts={colDefns[col].opts}
				styles={styles}/>))}
		</View>
	</View>)
	})
}
