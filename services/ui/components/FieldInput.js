import { useState, useContext, useEffect } from 'react'
import { View } from 'react-native'
import { Checkbox, SegmentedButtons, Text, TextInput } from 'react-native-paper'
import { FieldInputJson, FieldInputSelect } from '../components/'
import { FormContext } from '../contexts/'
import { jsonChanges } from '../utils/'
import getStyles from './styles'

export default function FieldInput({ label, format, keys, opts, required=false, visible=true }) {
	const { value, setValue, errors, setErrors } = useContext(FormContext)

	const getValue = function() {
		if(!!opts && opts.parent_update === 'value') {
			if(format === 'object') {
				return {[value[opts.parent_field]]:{}}
			} else {
				return value[opts.parent_field]
			}
		} else {
			let kcopy = keys.concat()
			let copy = Object.assign({}, value)
			let lst = kcopy.pop()
			let ptr = copy
			kcopy.map((k) => { if(!ptr[k]){ ptr[k] = {} } ptr = ptr[k] })
			return ptr[lst] ? ptr[lst] : null
		}
	}

	const getError = function() {
		const err = jsonChanges.objGet(errors, keys)
		if(!!err.error) {
			return err.error
		}
		return false
	}

	const updateValue = function(val) {
		const vals = jsonChanges.objSet(value, keys, val)
		setValue(vals)
		let copy = Object.assign({}, errors)
		const checks = jsonChanges.objGet(copy, keys.concat('checks'))
		if(Array.isArray(checks)) {
			for(const check of checks) {
				const err = check(vals, keys)
				if(!!err) {
					copy = jsonChanges.objSet(copy, keys.concat('error'), err)
				} else {
					copy = jsonChanges.objSet(copy, keys.concat('error'), false)
				}
			}
		}
		setErrors(copy)
	}

	const styles = getStyles()

	/* string */
	if(format === 'string') {

		return (<View>
			<TextInput
			 label={label}
			 value={getValue()}
			 error={!!getError()}
			 style={!visible ? {display:'none', ...styles.fieldInput} : styles.fieldInput}
			 onChangeText={value => updateValue(value)}/>
			<Text style={!getError() ? {display:'none'} : styles.fieldErrorContainer}>{getError()}</Text>
		</View>)

	/* multiline string */
	} else if(format === 'multiline') {
		return (<View>
			<TextInput
			 label={label}
			 value={getValue()}
			 multiline={true}
			 error={!!getError()}
			 style={!visible ? {display:'none', ...styles.fieldInput} : styles.fieldInput}
			 onChangeText={value => updateValue(value)}/>
			<Text style={!getError() ? {display:'none'} : styles.fieldErrorContainer}>{getError()}</Text>
		</View>)

	/* integer */	
	} else if(format === 'integer') {
		return (<View>
			<TextInput
			 label={label}
			 value={getValue()}
			 error={!!getError()}
			 style={!visible ? {display:'none', ...styles.fieldInput} : styles.fieldInput}
			 onChangeText={value => updateValue(parseInt(value))}/>
			<Text style={!getError() ? {display:'none'} : styles.fieldErrorContainer}>{getError()}</Text>
		</View>)

	/* date */
	} else if(format === 'date') { // TODO: something fancier
		return (<View>
			<TextInput
			 label={label}
			 value={getValue()}
			 error={!!getError()}
			 style={!visible ? {display:'none', ...styles.fieldInput} : styles.fieldInput}
			 onChangeText={value => updateValue(value)}/>
			<Text style={!getError() ? {display:'none'} : styles.fieldErrorContainer}>{getError()}</Text>
		</View>)

	/* boolean */
	} else if(format === 'boolean') {
		return (<View><View style={styles.fieldInputBoolContainer}>
			<Text
			 variant={styles.fieldInputBoolText.variant}
			 style={styles.fieldInputBoolText}>
				{label}
			</Text>
			<Checkbox
			 status={!!getValue() ? 'checked' : 'unchecked'}
			 onPress={() => updateValue(!getValue())}/>
			</View>
			<Text style={!getError() ? {display:'none'} : styles.fieldErrorContainer}>{getError()}</Text>
		</View>)
	
	/* enum */
	} else if(format === 'enum') {		
		return (<View style={styles.fieldInputEnumBorder}>
		<View style={styles.fieldInputEnumContainer}>
			<Text
			 variant={styles.fieldInputEnumText.variant}
			 style={!!getError() ? styles.fieldInputEnumTextError : styles.fieldInputEnumText}>
				{label}
			</Text>
			<FieldInputSelect
			 keys={keys}
			 val={getValue()}
			 setVal={updateValue}/>
		</View>
			<Text style={!getError() ? {display:'none'} : styles.fieldErrorContainer}>{getError()}</Text>
		</View>)

	/* uuid */
	} else if(format === 'uuid') { // TODO: something fancier
		return (<View><FieldInputSelect
			 opts={!!opts ? opts.data : {}}
			 keys={keys}
			 val={getValue()}
			 setVal={updateValue}/>
			<Text style={!getError() ? {display:'none'} : styles.fieldErrorContainer}>{getError()}</Text>
		</View>)

	/* json object */
	} else if(format === 'object') {
		return (<View><FieldInputJson
			 label={label}
			 val={getValue()}
			 error={!!getError()}
			 opts={opts}
			 keys={keys}
			 valChange={true}/>
			<Text style={!getError() ? {display:'none'} : styles.fieldErrorContainer}>{getError()}</Text>
		</View>)
	}
	return
}
