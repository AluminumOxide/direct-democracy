import { useState } from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import getStyles from './styles';

export default function Paragraph({ title, contents }) {
	const styles = getStyles()
	// show contents?
	const [show, setShow] = useState(true)

	// render component
	return (<View>

		{/* title */}
		<View
		 style={styles.paragraphTitle}>
			<View style={styles.paragraphTitleContainer}>
				<Text
				 style={styles.paragraphTitleText}
				 onPress={() => setShow(!show)}>
					{title}
				</Text>
				<IconButton
				 icon={show?'arrow-up':'arrow-down'}
				 onPress={() => setShow(!show)}
				 iconColor={styles.paragraphTitleButton.color}
				 size={styles.paragraphTitleButton.size}/>
			</View>
		</View>

		{/* contents */}
		{!!show && <View style={styles.paragraphContents}>
			{contents}
		</View>}
	</View>)
}
