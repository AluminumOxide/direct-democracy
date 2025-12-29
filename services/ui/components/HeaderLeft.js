import { useState, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Menu, IconButton, TextInput } from 'react-native-paper';
import { ThemeContext } from '../contexts/';
import getStyles from './styles';

export default function HeaderLeft({  }) {

	const { theme, updateTheme } = useContext(ThemeContext)
	const [ displayState, setDisplayState ] = useState(false)

	const handleUpdate = function(args) {
		if(!!!args.font) {
			setDisplayState(false)
		}
		updateTheme(args)
	}

	const styles = getStyles()
	return (<View style={styles.headerLeftContainer}>

		<Menu
		 visible={!!displayState}
		 onDismiss={() => setDisplayState(false)}
		 anchor={<IconButton
		 	  icon='cog'
			  size={styles.headerLeftButton.size}
			  iconColor={styles.headerLeftButton.color}
			  onPress={() => setDisplayState(true)}/>}>

		<Menu
		 visible={displayState==='font'}
		 onDismiss={() => setDisplayState(false)}
		 anchor={<Menu.Item
			  key='font'
			  title='Text Size' 
			  leadingIcon='format-size'
			  titleStyle={styles.headerLeftItem}
			  onPress={() => setDisplayState('font')}/>}>
			<Menu.Item
			 key='fontPlus'
			 title='Bigger'
			 leadingIcon='format-font-size-increase'
			 titleStyle={styles.headerLeftItem}
			 onPress={() => handleUpdate({ font: 0.1 })}/>
			<Menu.Item
			 key='fontMinus'
			 title='Smaller'
			 leadingIcon='format-font-size-decrease'
			 titleStyle={styles.headerLeftItem}
			 onPress={() => handleUpdate({ font: -0.1 })}/>	
		</Menu>

		<Menu
		 visible={displayState==='colour'}
		 onDismiss={() => setDisplayState(false)}
		 anchor={<Menu.Item
			  key='colour'
			  title='Theme Colour' 
			  leadingIcon='palette'
			  titleStyle={styles.headerLeftItem}
			  onPress={() => setDisplayState('colour')}/>}>
			{theme.colours.map((key) => (<Menu.Item
				key={key}
				title={key}
			  	titleStyle={styles.headerLeftItem}
				onPress={() => handleUpdate({ colour: key })}/>))}
		</Menu>
			<Menu
			 visible={displayState==='mode'}
			 onDismiss={() => setDisplayState(false)}
			 anchor={<Menu.Item
				 key='mode'
				 title='Day/Night Mode' 
			  	 titleStyle={styles.headerLeftItem}
				 leadingIcon='theme-light-dark'
				 onPress={() => setDisplayState('mode')}/>}>
				<Menu.Item
				 key='dark'
				 title='Night Mode' 
				 leadingIcon='weather-night'
			  	 titleStyle={styles.headerLeftItem}
				 onPress={() => handleUpdate({ mode: 'dark'})}/>
				<Menu.Item
				 key='light'
				 title='Day Mode' 
				 leadingIcon='weather-sunny'
			  	 titleStyle={styles.headerLeftItem}
				 onPress={() => handleUpdate({ mode: 'light'})}/>
			</Menu>

		</Menu>
	</View>)
}
