import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { PageContainer, FieldValue } from './';
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
			<Text style={styles.resultTitle} variant={styles.resultTitle.variant}>Verified</Text>
			<View style={styles.resultRow}>
				<Text style={styles.resultLabel}>Yes:</Text>
				<Text style={styles.resultValue}>{!!data.verified && data.verified.yes}</Text>
			</View>
			<View style={styles.resultRow}>
				<Text style={styles.resultLabel}>No:</Text>
				<Text style={styles.resultValue}>{!!data.verified && data.verified.no}</Text>
			</View>
			<Text style={styles.resultTitle} variant={styles.resultTitle.variant}>Unverified</Text>
			<View style={styles.resultRow}>
				<Text style={styles.resultLabel}>Yes:</Text>
				<Text style={styles.resultValue}>{!!data.unverified && data.unverified.yes}</Text>
			</View>
			<View style={styles.resultRow}>
				<Text style={styles.resultLabel}>No:</Text>
				<Text style={styles.resultValue}>{!!data.unverified && data.unverified.no}</Text>
			</View>
		</View>)
	})
}
