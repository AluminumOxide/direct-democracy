import { Component, useEffect, useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'
import { FormContext } from '../contexts/'
import getStyles from './styles';

export default function PageContainer({title, contents}) {

	const navigation = useNavigation()
	const { setValue, setData, setErrors } = useContext(FormContext)
	useEffect(() => {
		setValue({})
		setData({})
		setErrors({})
	}, [])

	const styles = getStyles()
	return (<ScrollView
		 style={styles.pageContainer}>
		<View
		 style={styles.pageHeadingContainer}>
			<Text
			 variant={styles.pageHeadingText.variant}
			 style={styles.pageHeadingText}>
				{title}
			</Text>
		</View>
		<View>
			{contents}
		</View>
	</ScrollView>);
}
