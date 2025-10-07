import { useState, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Chip, Icon, IconButton, Modal, Portal, Menu, Text, TextInput } from 'react-native-paper';
import { FormModal } from './'
import { FormContext } from '../contexts'
import getStyles from './styles';

export default function TableFilter({ filterCols, query, setQuery, cols, displayMode }) {

	// show menu?
	const [showMenu, setShowMenu] = useState(false)
	
	// filter form info
	const [popUp, setPopUp ] = useState({ id: false, keys:[] })
	const { value, setValue, defns, setDefns } = useContext(FormContext)
	const [ fields, setFields ] = useState({})

	// handle opening form
	const handleViewFilter = async(id, op) => {
		let opts = !!cols[id] ? cols[id].filters : {}
		if(!!query.filter[id]) {
			setValue({...value,
				op: query.filter[id].op,
				val: query.filter[id].val,
				opts
			})
		} else {
			setValue({...value,
				op: '',
				val: '',
				opts
			})
		}

		setPopUp({ id, keys:[] })
		setFields({
			...cols,
			'op': {
				title: 'Filter',
				format: 'enum',
				opts: {
					fetch: async () => {
						return !!cols[id] ? cols[id].filters.reduce((a,v) => ({...a, [v]:v}), {}) : {}
					}
				}
			},
			'val': {
				title: !!cols[id] ? cols[id].title : false,
				format: !!cols[id] && cols[id].format !== 'object' ? cols[id].format : 'string',
				opts: !!cols[id] && !!cols[id].opts ? cols[id].opts : {}
			}
		})
		setDefns({
			...defns,
			'op': {
				title: 'Filter',
				format: 'enum',
				opts: {
					fetch: async () => {
						return !!cols[id] ? cols[id].filters.reduce((a,v) => ({...a, [v]:v}), {}) : {}
					}
				}
			},
			'val': {
				title: !!cols[id] ? cols[id].title : false,
				format: !!cols[id] && cols[id].format !== 'object' ? cols[id].format : 'string',
				opts: !!cols[id] && !!cols[id].opts ? cols[id].opts : {}
			}
		})
		setShowMenu(false)
	}

	// handle removing chip
	const handleClearFilter = async(id) => {
		let copy = Object.assign({}, query.filter)
		delete copy[id]
		setQuery({...query, filter: copy })
	}

	// handle form submit
	const handleUpdateFilter = async({ id, op }) => {
		let copy = Object.assign({}, query.filter)
		copy[id] = {
			op: !!op ? op : value.op,
			val: value.val
		}
		setQuery({...query, filter: copy})
		setPopUp({
			id:false,
			keys: []
		})
		setShowMenu(false)
	}

	// split filter and search cols
	let searchCols = []
	filterCols.map(id => {
		if(['string','multiline','array','object'].indexOf(cols[id].format) >= 0) {
			searchCols.push(id) 
		}
	})
	filterCols = Array.from((new Set(filterCols)).difference(new Set(searchCols)))

	// render filter modal
	const styles = getStyles()
	return (<View style={styles.tableFilterContainer}>

		{/* filter menu drop down */}
		{displayMode=='table' && <Menu
		 visible={showMenu=='filter'}
		 onDismiss={() => setShowMenu(false)}
		 anchor={
			<IconButton
			 size={styles.tableFilterButton.size}
			 mode={styles.tableFilterButton.mode}
			 icon='filter'
			 onPress={() => setShowMenu('filter')}/>
		 }>
			{filterCols.map(id => {
				return (
				<Menu.Item
				 key={id}
				 title={cols[id].title}
				 titleStyle={styles.tableMenuText}
				 onPress={() => handleViewFilter(id)}/>)
			})}
		</Menu>}
		
		{/* filter modal */}
		<FormModal 
		 title='Filter'
		 formFields={['op','val']}
		 reqFields={['op','val']}
		 fields={fields}
		 keys={popUp.keys}
		 getVisibility={() => !!popUp.id && searchCols.indexOf(popUp.id) < 0}
		 submit={() => handleUpdateFilter({ id: popUp.id })}
		 cancel={() => setPopUp({ id:false }) || setShowMenu(false)}/>
		
		{/* search modal */}
		<FormModal 
		 title='Search'
		 formFields={['val']}
		 reqFields={['val']}
		 fields={fields}
		 keys={popUp.keys}
		 getVisibility={() => !!popUp.id && searchCols.indexOf(popUp.id) >= 0}
		 submit={() => handleUpdateFilter({ id: popUp.id, op: '~' })}
		 cancel={() => setPopUp({ id: false }) || setShowMenu(false)}/>

		{/* search menu drop down */}
		{displayMode=='table' && <Menu
		 visible={showMenu=='search'}
		 onDismiss={() => setShowMenu(false)}
		 anchor={
			<IconButton
			 size={styles.tableFilterButton.size}
			 mode={styles.tableFilterButton.mode}
			 icon='magnify'
			 onPress={() => setShowMenu('search')}/>
		 }>
			{searchCols.map(id => {
				return (
				<Menu.Item
				 key={id}
				 title={cols[id].title}
				 titleStyle={styles.tableMenuText}
				 onPress={() => handleViewFilter(id, '~')}/>)
			})}
		</Menu>}
		

		{/* filter chips */}
		<View style={styles.tableFilterChipContainer}>
		{Object.keys(query.filter).map(id => (
			<Chip
			 key={'chip-'+id}
			 style={styles.tableFilterChip}
			 closeIcon={() => (
				 <Icon
				  source='close'
				  size={styles.tableFilterChipClose.size}
				  color={styles.tableFilterChipClose.color}/>
			 )}
			 onPress={() => id!=='mine'&&handleViewFilter(id)}
			 onClose={() => handleClearFilter(id)}>
			 	<Text
				 style={styles.tableFilterChipText}
				 variant={styles.tableFilterChipText.variant}>
					{id === 'mine' ? 'Mine' : cols[id].title+' '+query.filter[id].op+' '+query.filter[id].val}
				</Text>
        		</Chip>
		))}
		</View>
	</View>)
}
