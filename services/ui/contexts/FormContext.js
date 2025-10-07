import { createContext, useState } from 'react'

const FormContext = createContext(null)
const { Provider } = FormContext

const FormProvider = ({ children }) => {

	const [value, setValue] = useState({})
	const [data, setData] = useState({})
	const [errors, setErrors] = useState({})
	const [defns, setDefns] = useState({})

	return (<Provider value={{value, setValue, data, setData, defns, setDefns, errors, setErrors}}>
			{children}
		</Provider>)
}

export { FormProvider, FormContext }
