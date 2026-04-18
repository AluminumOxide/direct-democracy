import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { PageContainer, FieldRow, FieldValue, Paragraph, ReportButton } from './';
import getStyles from './styles';

export default function ResultView({ title, getData }) {

	// load data
	const [ data, setData ] = useState([]);
	const fetchData = async() => {
		setData(await getData());
	}
	useEffect(() => { fetchData() }, []);

	// render component
	const styles = getStyles()
	return PageContainer({
		title,
		contents: (<View style={styles.resultContainer}>
			<Text style={styles.resultTitle} variant={styles.resultTitle.variant}>Yes: {!!data.total && data.total.yes}</Text>
			<View style={styles.resultRow}>
				<Text style={styles.resultLabel}>Verified: </Text>
				<Text style={styles.resultValue}>{!!data.verified && data.verified.yes}</Text>
			</View>
			<View style={styles.resultRow}>
				<Text style={styles.resultLabel}>Unverified: </Text>
				<Text style={styles.resultValue}>{!!data.unverified && data.unverified.yes}</Text>
			</View>

			<Text style={styles.resultTitle} variant={styles.resultTitle.variant}>No: {!!data.total && data.total.no}</Text>
			<View style={styles.resultRow}>
				<Text style={styles.resultLabel}>Verified: </Text>
				<Text style={styles.resultValue}>{!!data.verified && data.verified.no}</Text>
			</View>
			<View style={styles.resultRow}>
				<Text style={styles.resultLabel}>Unverified: </Text>
				<Text style={styles.resultValue}>{!!data.unverified && data.unverified.no}</Text>
			</View>
		
			<Paragraph
			  title='Approving Comments'
			  contents={(!!data.comments && data.comments.yes.map(c =>
				  <View style={{flexDirection: 'row', alignItems: 'center', width:'100%'}}>{c.comments}<ReportButton text='ballot_comments' target='ballot' id={c.id} democracy={data.democracy}/></View>
			  ))}/>
			
			<Paragraph
			  title='Disapproving Comments'
			  contents={(!!data.comments && data.comments.no.map(c =>
				  <View style={{flexDirection: 'row', alignItems: 'center', width:'100%'}}>{c.comments}<ReportButton text='ballot_comments' target='ballot' id={c.id} democracy={data.democracy}/></View>
			  ))}/>
		</View>)
	})
}
