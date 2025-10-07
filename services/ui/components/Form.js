import { useEffect, useState, useContext } from 'react';
import { View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import { PageContainer, Paragraph, FieldInput } from './';
import { FormContext } from '../contexts'
import { jsonChanges } from '../utils/'
import getStyles from './styles';

export default function Form({ formFields=[], reqFields=[], fields={}, keys=[], submit, cancel }) {

	const {
		value, setValue,
		data, setData,
		defns, setDefns,
		errors, setErrors
	} = useContext(FormContext)

	// set up initial field defns
	useEffect(() => { 
		let defn = Object.assign({}, defns)
		for (const fld of formFields) {
			defn[fld] = Object.assign({}, fields[fld])
		}
		setDefns(defn)
	}, [])

	// fetch field data
	const fetchData = async() => {
		let err = Object.assign({}, errors)
		let datas = Object.assign({}, data)
		for (const fld of formFields) {

			if(reqFields.indexOf(fld) >= 0) {
				err[fld] = { error: false, checks: [function(v, k) {
					const c = jsonChanges.objGet(Object.assign({},v), k)
					if(!c || (typeof(c) == 'object' && Object.keys(c) == 0)) {
						return 'Required Field'
					}
					return false
				}]}
			} else {
				err[fld] = { error: false, checks: [] }
			}

			// fetch data for uuids
			if(!!fields[fld] && fields[fld].format === 'uuid' && !!fields[fld].opts.fetch) {
				datas[fld] = await fields[fld].opts.fetch()
			
			// fetch data for enums
			} else if(!!fields[fld] && fields[fld].format === 'enum' && !!fields[fld].fetch) {
				datas[fld] = await fields[fld].fetch()

			// fetch data for objects
			} else if(!!fields[fld] && fields[fld].format === 'object' && !!fields[fld].opts.fetch) {
				if((!datas[fld] || !datas[fld].mode) && !!value.id) {
					datas[fld] = await fields[fld].opts.fetch(value.id)
					datas.mode = {
                                		val: 'Add Value',
                                		section: 'Add Section'
					}
				}
			}
		}
		if(data !== datas) {
			setData(datas)
		}
		setErrors(err)
	}
	useEffect(() => { fetchData() }, [defns])

	// check form data
	const checkData = async() => {
		let is_err = true
		let errs = Object.assign({}, errors)
		for (const fld of formFields) {
			if(Array.isArray(errors[fld].checks)) {
				for (const check of errors[fld].checks) {
					const err = check(value, [fld])
					if(!!err) {
						is_err = false
						errs[fld].error = err
					} else {
						errs[fld].error = false
					}
				}
			}
		}
		setErrors(errs)
		return is_err
	}

	// submit form data
	const handleSubmit = async() => {
		const check = await checkData()
		if(!!check) {
			try {
				await submit(Object.assign({}, value))
			} catch(e) {
				setErrors({ ...errors, error: e.toString() })
			}
		}
	}

	// calculate field label
	const getLabel = (fld) => {
		const defn = defns[fld]
		if(!!defn && !!defn.opts && defn.opts.parent_update=='label') {
			if(!!defn.opts.parent_fxn) {
				return defn.opts.parent_fxn(value[defn.opts.parent_field])
			} else {
				return value[defn.opts.parent_field]
			}
		} else if(!!defn) {
			return defn.title
		} else {
			return ""
		}
	}

	// calculate field visibility
	const getVisible = (fld) => {
		const defn = defns[fld]
		if(!!defn && !!defn.opts && defn.opts.parent_update=='visible') {
			let kcopy = keys.concat()
			let copy = Object.assign({}, value)
			let ptr = copy
			kcopy.map((k) => {if(!ptr[k]){ ptr[k] = {} } ptr = ptr[k] })
			let val = ptr[defn.opts.parent_field]
			if(!!defn.opts.parent_fxn) {
				return defn.opts.parent_fxn(val)
			}
			return val
		} else if(!!defn) {
			return !!defn.visible ? defn.visible : true
		} else {
			return true
		}

	}

	// check if field is required
	const getRequired = (fld) => {
		return reqFields.indexOf(fld) >=0
	}

	// render component
	const styles = getStyles()
	return (<View>
		<View>
		{!!defns && formFields.map((fld) => {
			return (
			<FieldInput
			 format={!!defns[fld] ? defns[fld].format : 'string'}
			 opts={!!defns[fld] ? defns[fld].opts : {}}
			 label={getLabel(fld)}
			 visible={getVisible(fld)}
			 required={getRequired(fld)}
			 keys={keys.concat(fld)}/>)})}
		</View>
		<View style={!errors.error ? {display:'none'} : styles.fieldErrorContainer}>{!!errors.error ? errors.error : null}</View>
		<View style={styles.formContainer}>
			<Button
			 onPress={handleSubmit}
			 icon='check'
			 mode={styles.formButton.mode}
			 style={styles.formButton}
			 labelStyle={styles.formButtonText}>
				Save
			</Button>
			<Button
			 icon='cancel'
			 onPress={() => cancel()}
			 mode={styles.formButton.mode}
			 style={styles.formButton}
			 labelStyle={styles.formButtonText}>
				Cancel
			</Button>
		</View>
	</View>)
}
