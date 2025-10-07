import { useWindowDimensions, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const isSmall = function() {
	return useWindowDimensions().width < 800;
}

const getFontSize = function(size) {
	const theme = useTheme()
	return !!theme.font ? theme.font*size : size
}

const getStyles = function() {
	const theme = useTheme()
	return StyleSheet.create({
	headerContainer: {
		backgroundColor: theme.colors.background,
	},
	headerLeftContainer: {
		flexDirection: 'row'
	},
	headerLeftButton: {
		color: theme.colors.primary,
		size: getFontSize(25)
	},
	headerTitleContainer: {
		padding: 5,
	},
	headerTitleText: {
		margin: 5,
		fontWeight: 'bold',
		variant: 'headlineMedium',
		fontSize: getFontSize(28)
	},
	headerRightContainer: {
		flexDirection: 'row'
	},
	headerRightButton: {
		margin: 5,
		color: theme.colors.primary,
		size: getFontSize(25)
	},
	headerRightItem: {
		padding: 5,
		fontSize: getFontSize(16)
	},
	headerLeftItem: {
		padding: 5,
		fontSize: getFontSize(16)
	},
	pageContainer: {
		backgroundColor: theme.colors.background,
		color: theme.colors.onBackground
	},
	pageHeadingContainer: {
		backgroundColor: theme.colors.primaryContainer,
		flexDirection: 'row',
		justifyContent: 'center',
		borderBottomWidth:1,
		borderBottomColor: theme.colors.primary,
		padding: 10
	},
	pageHeadingText: {
		color: theme.colors.primary,
		fontWeight: 'bold',
		variant: 'titleMedium',
		fontSize: getFontSize(16)
	},
	pageModal: {
		backgroundColor: theme.colors.background,
		padding: 20,
		justifyContent: 'center'
	},
	pageModalTitle: {
		alignSelf: 'center',
		variant: 'titleMedium',
		fontSize: getFontSize(16)
	},
	linkText: {
		color: theme.colors.primary,
		textDecorationLine: 'underline'
	},
	paragraphTitle: {
		flexDirection:'row',
		backgroundColor: theme.colors.primaryContainer,
		justifyContent:'space-between',
		alignItems:'center',
		borderBottomWidth:1,
		borderBottomColor: theme.colors.primary,
	},
	paragraphTitleContainer: {
		flexDirection:'row',
		alignItems:'center'
	},
	paragraphTitleText: {
		marginRight:5,
		fontWeight:'bold',
		marginLeft:10,
		marginRight:5,
		fontSize: getFontSize(14)
	},
	paragraphTitleButton: {
		color: theme.colors.primary,
		size: getFontSize(15)
	},
	paragraphContents: {
		paddingLeft:5,
		marginLeft:5,
		fontSize: getFontSize(14)
	},
	tableModeButton: {
		size: getFontSize(20),
		flexDirection:'row',
		justifyContent:'flex-end'
	},
	tableMenu: {
		flexDirection:'row',
		justifyContent:'flex-start'
	},
	tableMenuText: {
		padding: 5,
		fontSize: getFontSize(16)
	},
	tableMenuContainer: {
		flexDirection:'row',
		flexWrap:'wrap'
	},
	tableDisplayButton: {
		size: getFontSize(20),
		mode: 'contained'
	},
	tableSortButton: {
		size: getFontSize(20),
		mode: 'contained'
	},
	tableFilterButton: {
		size: getFontSize(20),
		mode: 'contained'
	},
	tableFilterContainer: {
		flexDirection: 'row-reverse',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		flex: 2
	},
	tableFilterTitle: {
		alignSelf: 'center',
		variant: 'titleMedium',
		fontSize: getFontSize(16)
	},
	tableFilterInput: {
		textAlign: 'center',
		fontSize: getFontSize(14)
	},
	tableFilterSubmit: {
		mode: 'contained'
	},
	tableFilterChip: {
		margin: 5,
		backgroundColor: theme.colors.primaryContainer
	},
	tableFilterChipText: {
		color: theme.colors.primary,
		variant: 'titleSmall',
		fontSize: getFontSize(14)
	},
	tableFilterChipClose: {
		color: theme.colors.primary,
		size: 15
	},
	tableFilterChipContainer: {
		flexDirection:'row',
		flexWrap:'wrap',
		flex:1
	},
	tableHeader: {
		color: theme.colors.onSurfaceDisabled,
		fontSize: getFontSize(12)
	},
	tableCell: {
		fontSize: getFontSize(14)
	},
	tableCellBool: {
		maxWidth: 50,
		fontSize: getFontSize(14)
	},
	tableCellFirst: {
		fontSize: getFontSize(14),
		justifyContent: 'flex-end',
		paddingRight: 10
	},
	tableCellTextFirst: {
		color: theme.colors.primary,
		fontWeight: 'bold',
		fontSize: getFontSize(14)
	},
	detailContainer: {
		gap: 20,
		paddingTop:20,
		flexDirection: isSmall() ? 'column' : 'row',
		flexWrap: isSmall() ? 'nowrap' : 'wrap'
	},
	detailShortContainer: {
		flex: 1,
		justifyContent:'center',
		paddingLeft:20,
		paddingRight:20
	},
	detailActionContainer: {
		flex: 1,
		paddingLeft:20,
		paddingRight:20
	},
	detailActionButton: {
		mode: 'contained',
		margin: 5,
	},
	detailActionButtonText: {
		padding: 5,
		fontSize: getFontSize(14)
	},
	detailLongContainer: {
		width: '100%',
		paddingLeft:20,
		paddingRight:20
	},
	confirmContainer: {
		justifyContent:'center',
		flexDirection:'row',
		padding:20
	},
	confirmButtons: {
		margin: 5,
		mode: 'contained',
	},
	confirmButtonsText: {
		fontSize: getFontSize(14)
	},
	formContainer: {
		flexDirection:'row',
		justifyContent:'center',
	},
	formButton: {
		margin:5,
		mode:'contained',
	},
	formButtonText: {
		fontSize: getFontSize(14)
	},
	accountContainer: {
		padding: 20
	},
	accountButton: {
		margin:5,
		mode:'contained-tonal', 
	},
	accountButtonText: {
		padding:5,
		fontSize: getFontSize(14)
	},
	fieldValueContainer: {
		flexDirection:'row',
	},
	fieldValueLabel: {
		fontWeight:'bold',
		fontSize: getFontSize(14)
	},
	fieldValueText: {
		fontSize: getFontSize(14)
	},
	fieldErrorContainer: {
		color: theme.colors.onError,
		backgroundColor: theme.colors.error,
		padding: 2,
		paddingLeft: 20,
		fontStyle: 'italic'
	},
	fieldInputBoolContainer: {
		backgroundColor: theme.colors.surfaceVariant,
		paddingLeft:9,
		borderBottomWidth:1
	},
	fieldInputBoolText: {
		color: theme.colors.onSurfaceVariant,
		paddingLeft:7,
		variant: 'bodySmall',
		fontSize: getFontSize(12)
	},
	fieldInputEnumBorder: {
		backgroundColor: theme.colors.surfaceVariant,
		borderBottomWidth:1,
	},
	fieldInputEnumContainer: {
		paddingLeft:9,
		paddingBottom:10,
		paddingright:5
	},
	fieldInputEnumText: {
		color: theme.colors.onSurfaceVariant,
		paddingLeft:7,
		marginTop:10,
		variant: 'bodySmall',
		fontSize: getFontSize(12)
	},
	fieldInputEnumTextError: {
		color: theme.colors.error,
		paddingLeft:7,
		marginTop:10,
		variant: 'bodySmall',
		fontSize: getFontSize(12)
	},
	fieldInput: {
		fontSize: getFontSize(16)
	},
	fieldInputLabel: {
		color: theme.colors.onSurfaceVariant,
		fontSize: getFontSize(14)
	},
	fieldSelectContainer: {
		flexDirection:'row',
		flexWrap: 'wrap',
		justifyContent:'center',
		alignItems:'center'
	},
	fieldSelectSelected: {
		mode: 'contained',
	},
	fieldSelectUnselected: {
		mode: 'contained-tonal',
	},
	fieldSelectLabel: {
		padding: 5,
		fontSize: getFontSize(16)
	},
	fieldInputJsonButton: {
		size: getFontSize(20),
		color: theme.colors.onPrimary,
		backgroundColor: theme.colors.primary
	},
	resultTitle: {
		color: theme.colors.primary,
		fontWeight: 'bold',
		variant: 'bodyLarge',
		fontSize: getFontSize(16)
	},
	resultLabel: {
		fontWeight: 'bold',
		fontSize: getFontSize(14)
	},
	resultRow: {
		flexDirection: 'row',
	},
	resultValue: {
		fontSize: getFontSize(14)
	},
	resultContainer: {
		alignItems: 'center',
		padding: 5
	}
})}
export default getStyles;
