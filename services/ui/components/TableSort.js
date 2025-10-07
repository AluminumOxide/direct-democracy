import { useState } from 'react';
import { View } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import getStyles from './styles';

export default function TableSort({ sortCols, query, setQuery, cols, setCols }) {

	// show menu?
	const [showMenu, setShowMenu] = useState(false);

	// handle sort change
	const handleUpdateSort = async(id) => {
		let copy = Object.assign({}, cols)
		sortCols.map(col => {
			if(col == id) {
				if(copy[col].sort == 'ASC') {
					copy[col].sort = 'DESC'
				} else if(copy[col].sort == 'DESC') {
					copy[col].sort = 'ASC'
				} else {
					copy[col].sort = 'ASC'
				}
			} else {
				copy[col].sort = false
			}
		})
		setCols(copy)
		setQuery({...query, sort: id, order: cols[id].sort })
	}

	// render component
	const styles = getStyles()
	return (<View>
		<Menu
		 visible={showMenu}
		 onDismiss={() => setShowMenu(false)}
		 anchor={
			 <IconButton
			  size={styles.tableSortButton.size}
			  mode={styles.tableSortButton.mode}
			  icon='sort'
			  selected={showMenu}
			  onPress={() => setShowMenu(!showMenu)}/>
		 }>
			{sortCols.map(id => (
				<Menu.Item
				 key={id}
				 title={cols[id].title}
				 titleStyle={styles.tableMenuText}
				 leadingIcon={cols[id].sort=='ASC' ? 
					 'sort-ascending' : cols[id].sort=='DESC' ?
					 	'sort-descending' : 'sort'}
				 onPress={() => handleUpdateSort(id)}>
				</Menu.Item>))}
		</Menu>
	</View>)
}
