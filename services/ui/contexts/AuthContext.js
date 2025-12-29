import { createContext, useState } from 'react';

const AuthContext = createContext(null);
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
	const [authState, setAuthState] = useState({
		state: false,
		jwt: null,
		memberships:{}
	});

	return (
		<Provider value={{authState, setAuthState}}>
		{children}
		</Provider>
	);
};

export { AuthProvider, AuthContext };
