import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { PageContainer, FieldRow, ReportButton } from './';
import getStyles from './styles';

export default function DetailView({ id, target, democracy, nameField, shortFields, longFields, getData, colDefns, actions, reportFields=[] }) {

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
		buttons: reportFields.indexOf(nameField) >= 0 ? ReportButton({text: nameField, target, keys:[], id, democracy}) : false,
		contents: (<View style={styles.detailContainer}>

		{/* short details */}
		<View style={styles.detailShortContainer}>
		{shortFields.map((col) => (<FieldRow
			key={'sd-'+col}
			label={colDefns[col].title}
			report={reportFields.indexOf(col) >= 0 ? {text: col, target, id, democracy} : false}
			data={data[col]}
			format={colDefns[col].format}
			opts={colDefns[col].opts}
			styles={styles}/>))}
		</View>

		{/* action buttons */}
		<View style={styles.detailActionContainer}>
			{actions.map((act) => (<Button
				key={'ab-'+act.title}
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
				key={'ld-'+col}
				label={colDefns[col].title}
				report={reportFields.indexOf(col) >= 0 ? {text: col, target, id, democracy} : false}
				data={data[col]}
				format={colDefns[col].format}
				opts={colDefns[col].opts}
				styles={styles}/>))}
		</View>
	</View>)
	})
}
