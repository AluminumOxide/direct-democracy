import { useState } from 'react';
import { View } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import getStyles from './styles';

export default function TableDisplay({ displayCols=[], cols, setCols }) {

	// show menu?
	const [showMenu, setShowMenu] = useState(false)
	
	// handle display change
	const handleUpdateDisplay = async(c) => {
		let copy = Object.assign({}, cols)
		copy[c].display = !copy[c].display
		setCols(copy)
	}

	// render component
	const styles = getStyles()
	return (<View>
		<Menu
		 visible={showMenu}
		 onDismiss={() => setShowMenu(false)}
		 anchor={
			<IconButton
			 size={styles.tableDisplayButton.size}
			 mode={styles.tableDisplayButton.mode}
			 icon='eye'
			 selected={showMenu}
			 onPress={() => setShowMenu(!showMenu)}/>
		 }>
			{displayCols.map(id => (
				<Menu.Item 
				 key={id}
				 title={cols[id].title}
				 titleStyle={styles.tableMenuText}
				 leadingIcon={cols[id].display ? "eye-off" : "eye"}
				 onPress={() => handleUpdateDisplay(id)}/>
			))}
		</Menu>	
	</View>)
}
