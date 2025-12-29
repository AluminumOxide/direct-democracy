import { useEffect, useState, useContext } from 'react'
import { View } from 'react-native'
import { Button, Checkbox, IconButton, Modal, Portal, SegmentedButtons, Text, TextInput } from 'react-native-paper'
import { FieldInput, FieldInputSelect, FormModal, Paragraph } from '.'
import getStyles from './styles'
import { FormContext } from '../contexts/'
import { jsonChanges } from '../utils/'

export default function FieldInputJson({ label, val, opts, keys: valKeys, valChange=true }) {

	const [ changes, setChanges ] = useState({})
	const { value, setValue, data, setData } = useContext(FormContext)
	useEffect(() => {
		if(!!valChange) {
			setValue({...value, ...changes})
		}
	}, [changes])
	useEffect(() => {
		if(!valChange) {
			setValue({...value, [Object.keys(val)[0]]: data[Object.keys(val)[0]]})
		}
	}, [data])

	const handleChange = function(keys, val) {

		// update data
		setData({...data, proposal_changes: jsonChanges.objAdd(data.proposal_changes, keys, val)})

		// update changes
		let kcopy = valKeys.concat(keys)
		let lst = kcopy.pop()
		setChanges(jsonChanges.objAdd(changes, kcopy.concat('_update').concat(lst), val))
	}

	const handleClose = function(k,keys) {

		// update data
		setData({...data, proposal_changes: jsonChanges.objDel(data.proposal_changes, keys, k)})

		// update changes
		setChanges(jsonChanges.objAdd(changes, valKeys.concat(keys).concat('_delete'), [k]))
	}

	const handleAdd = function(k, keys, allKeys) {	

		/* get values */
		let copy = Object.assign({}, value)
		let kcopy = allKeys.concat()
		let nm, vl
		let old = jsonChanges.objGet(copy, [])
		if(old.mode === 'val') {
			nm = old.field_name
			vl = old.field_val
			copy = jsonChanges.objDel(copy, [], 'mode')
			copy = jsonChanges.objDel(copy, [], 'field_name')
			copy = jsonChanges.objDel(copy, [], 'field_val')
		} else {
			nm = old.section_name
			vl = {}
			copy = jsonChanges.objDel(copy, [], 'mode')
			copy = jsonChanges.objDel(copy, [], 'section_name')
		}
		setValue(copy)

		/* update changes */
		let nw = jsonChanges.objAlt(copy, kcopy.concat(nm), '_add')
		if(!nw) {
			nw = kcopy.concat(['_add', nm])
		}
		setChanges(jsonChanges.objAdd(changes, nw, vl))
		
		/* update data */
		setData({
			...data,
			proposal_changes: jsonChanges.objAdd(data.proposal_changes, keys.concat([k, nm]), vl),
			field_name: null,
			field_val: null,
			section_name: null
		})
		
	}

	const [addField, setAddField] = useState({
		show: false,
		k: null,
		keys: null,
		allKeys: null
	})
	const handleViewAdd = function(k,keys) {
		setAddField({
			show: true, 
			k, 
			keys,
			allKeys: valKeys.concat(keys).concat(k)
		})	
	}
	const handleHideAdd = function() {
		setAddField({
			show: false,
			k: null,
			keys: null,
			allKeys: null
		})
	}

	// render input field
	const styles = getStyles()
	const drawRow = function(vals, keys) {
		return Object.keys(!!vals?vals:{}).map((k) => {
			if(typeof vals[k] == 'object') {
				return (<View>
					<View
					 style={styles.paragraphTitle}>
						<View style={styles.paragraphTitleContainer}>
							<Text
							 style={styles.paragraphTitleText}>
								{k}
							</Text>
						</View>
						<View style={styles.paragraphTitleContainer}>
							<IconButton
							 icon={'plus'}
						  	 iconColor={styles.fieldInputJsonButton.color}
						  	 style={styles.fieldInputJsonButton}
						  	 size={styles.fieldInputJsonButton.size}
							 onPress={() => handleViewAdd(k,keys)}/>
							<IconButton
							 icon={'close'}
						  	 iconColor={styles.fieldInputJsonButton.color}
						  	 style={styles.fieldInputJsonButton}
						  	 size={styles.fieldInputJsonButton.size}
							 onPress={() => handleClose(k,keys)}/>
						</View>
					</View>
					<View style={styles.paragraphContents}>
						{drawRow(vals[k], keys.concat(k))}
					</View>
					</View>)
			} else {
				return (
					<TextInput
					 label={k}
					 value={vals[k]}
					 right={keys.length>0 ? 
						 <TextInput.Icon
						  icon='close'
						  color={styles.fieldInputJsonButton.color}
						  style={styles.fieldInputJsonButton}
						  size={styles.fieldInputJsonButton.size}
						  onPress={() => handleClose(k,keys)}/> : {}}
					 style={styles.fieldInput}
					 onChangeText={v => handleChange(keys.concat(k), v)}	
					/>
				)
			}
		})
	}

	return (<View>
		<FormModal
		 title=''
		 formFields={['mode','field_name','field_val','section_name']}
		 keys={[]}
		 fields={{
			mode: {
				title: 'What would you like to add?',
				format: 'enum',
				fetch: async function() {
					return {
					val: 'Add Value',
					section: 'Add Section'
					}
				}
			},
			field_name: {
				title: 'Field Name',
				format: 'string',
				opts: {
					parent_field: 'mode',
					parent_update: 'visible',
					parent_fxn: (m) => m === 'val'
				}
			},
			field_val: {
				title: 'Field Value',
				format: 'string',
				opts: {
					parent_field: 'mode',
					parent_update: 'visible',
					parent_fxn: (m) => m === 'val'
				}
			},
			section_name: {
				title: 'Section Name',
				format: 'string',
				opts: {
					parent_field: 'mode',
					parent_update: 'visible',
					parent_fxn: (m) => m === 'section'
				}
			},
		 }}
		 getVisibility={() => addField.show}
		 submit={() => handleAdd(addField.k, addField.keys, addField.allKeys) || handleHideAdd()}
		 cancel={() => handleHideAdd() }/>
		{drawRow(!!val && !!data && !!data.proposal_changes ? {[Object.keys(val)[0]]: data.proposal_changes[Object.keys(val)[0]]} : {},[])}
	</View>)
}
