import { TimeOut } from '../components/'

export default function TimeOutScreen({ route }) {

	const democracyId = route.params.id
	const end = route.params.end

	return (<TimeOut 
		  democracyId={democracyId}
		  end={end}
		  backButton={true}/>)

}
