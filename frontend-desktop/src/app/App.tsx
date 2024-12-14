import {BrowserRouter} from "react-router-dom"

import { ThemeProvider } from "@/shared/lib/providers"

import { RouterView } from './router'
import { StoreProvider } from './store'

function App() {
	return (
		<StoreProvider>
			<BrowserRouter>
				<ThemeProvider>
					<RouterView />
				</ThemeProvider>
			</BrowserRouter>
		</StoreProvider>
	)
}

export default App
