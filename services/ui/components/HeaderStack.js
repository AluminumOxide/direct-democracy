import { useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderLeft, HeaderTitle, HeaderRight } from './';
import { ThemeContext } from '../contexts/';
import screens from '../screens/';
import getStyles from './styles'

export default function HeaderStack() {

	// get themes and styles
	const styles = getStyles()
	const { theme, updateTheme } = useContext(ThemeContext)

	// create navigation stack
	const Stack = createNativeStackNavigator()

	// render header
	return (<PaperProvider theme={theme.theme}>
		<NavigationContainer linking={{enabled: 'auto'}}>
		<Stack.Navigator 
		 screenOptions={{
			headerTitleAlign: 'center',
			headerStyle: {backgroundColor: theme.theme.colors.background},
			headerTitle: (props) => (<HeaderTitle  {...props} />),
			headerRight: (props) => (<HeaderRight {...props} />),
			headerLeft: (props) => (<HeaderLeft  {...props} />),
			 
		 }}>
		{Object.keys(screens).map((screen) => (
			<Stack.Screen name={screen} component={screens[screen]}/>
		))}
		</Stack.Navigator>
		</NavigationContainer>
		</PaperProvider>)
}
