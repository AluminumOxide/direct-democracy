import { HeaderStack } from './components/';
import { AuthProvider, ThemeProvider, FormProvider } from './contexts/';

export default function App() {
	return (<ThemeProvider>
			<AuthProvider>
				<FormProvider>
					<HeaderStack/>
				</FormProvider>
			</AuthProvider>
		</ThemeProvider>)
}
