import { useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FormContext } from '../contexts/';
import { PageContainer, Form } from './';

export default function FormView({ id, title, formFields, reqFields, fields, proceed, nextScreen }) {
	const navigation = useNavigation()
	const { setValue, setData, setErrors } = useContext(FormContext)

	// handle form submission
	const submit = async function(formValues) {
		navigation.navigate(nextScreen, await proceed(formValues))
	}

	// handle form cancel
	const cancel = async function() {
		navigation.goBack()
	}

	// render component
	return (<PageContainer
		 title={title}
		 contents={Form({ id, formFields, reqFields, fields, submit, cancel })} />)
}
