import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { DataTable, IconButton, Menu, Text } from 'react-native-paper';
import { FieldValue, TableFilter, TableDisplay, TableSort, PageContainer } from './';
import getStyles from './styles';

export default function TableView({ title, idField, sortCols, displayCols, filterCols, getData, rowPress, colDefns, filters }) {

	// api query
	const [ query, setQuery ] = useState({
		sort: false,
		order: false,
		filter: filters
	});

	// api data
	const [ data, setData ] = useState([]);
	const fetchData = async() => {
		setData(await getData({ query }));
	}
	useEffect(() => { fetchData() }, [query]);

	// api spec
	const [ cols, setCols ] = useState(colDefns);

	// list or table mode?
	const [displayMode, setDisplayMode] = useState('list')

	// menu components
	const display = TableDisplay({ displayCols, cols, setCols })
	const sort = TableSort({ sortCols, query, setQuery, cols, setCols })
	const filter = TableFilter({ filterCols, query, setQuery, cols, displayMode })

	// render component
	const styles = getStyles()
	return PageContainer({ title, contents:(<View>
		<View style={styles.tableModeButton}>
			{filter}

		{/* menu in table mode */}
                {displayMode=='table' && <View style={styles.tableMenu}>

			{display}
			{sort}
                </View>}
		
		{/* button to switch list/table modes */}
                {displayMode=='list' && <View style={styles.tableModeButton}>
                        <IconButton
			 size={styles.tableModeButton.size}
			 icon='table'
			 onPress={() => setDisplayMode('table')}/>
                </View>}
		</View>

		{/* table headers */}
		<DataTable>
		{displayMode=='table' && <DataTable.Header >
		{Object.keys(cols).map(id => {
			const col = cols[id]
			if(!!col.display) {
				return (<DataTable.Title
					 style={styles.tableHeader}
					 key={id}>
				<Text style={styles.tableHeader}>{col.title}</Text>
					</DataTable.Title>)
			}
		})}
		</DataTable.Header>}

		{/* table contents */}
		{data.map((item) => (
			<DataTable.Row
			 key={item[idField]}
			 onPress={() => rowPress(item) }>
				{Object.keys(cols).map((id,i) => {
					const col = cols[id]
					if(!!col.display) {
						return (<DataTable.Cell
							 key={id}
							 style={ (i==0 && displayMode=='list') ? styles.tableCellFirst : ( col.format=='boolean' && displayMode=='list' ? styles.tableCellBool : styles.tableCell )}>
							<FieldValue
							 data={item[id]}
							 format={col.format}
							 layout='short'
							 textStyle={i==0 && displayMode=='list' ? styles.tableCellTextFirst : {}}
							 styles={styles} />
						</DataTable.Cell>)
					}
				})}
			</DataTable.Row>
		))}
		</DataTable>
	</View>)
	})
}
