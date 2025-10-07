import { createContext, useState } from 'react';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

const ThemeContext = createContext(null);
const { Provider } = ThemeContext;

const ThemeProvider = ({ children }) => {

	// get colour themes from config file
	const themes = require('../themes')

	// set default values
	const dColour = 'purple'
	const dMode = 'light'
	const dFont = 1
	const dTheme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			...themes[dColour+'_'+dMode].colors
		}
	}

	// theme state
	const [theme, setTheme] = useState({
		colours: [...new Set(Object.keys(themes).map(c => c.split('_')[0]))],
		colour: dColour,
		mode: dMode,
		font: dFont,
		theme: dTheme,
		themes
	})

        const updateTheme = function({colour, mode, font}) {
                if(!!colour) {
                        setTheme({
				...theme,
				colour: colour,
				theme: {
					...theme.theme,
					colors: theme.themes[colour+'_'+theme.mode].colors
				}
                        })
                }
                if(!!mode) {
                        setTheme({
				...theme,
				mode: mode,
				theme: {
					...theme.theme,
					colors: theme.themes[theme.colour+'_'+mode].colors
				}
                        })
                }
		if(!!font) {
			setTheme({
				...theme,
				font: theme.font + font,
				theme: {
					...theme.theme,
					font: theme.font + font,
				}
			})
		}
        }

	// render provider
	return (
		<Provider value={{theme, updateTheme}}>
		{children}
		</Provider>
	);
};

export { ThemeProvider, ThemeContext };
