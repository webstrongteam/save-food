import React, { Component } from 'react'
import { LogBox } from 'react-native'
import FlashMessage from 'react-native-flash-message'
import thunk from 'redux-thunk'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import { loadAsync } from 'expo-font'
import { setCustomText } from 'react-native-global-props'
import Router from './src/router'
import Spinner from './src/components/Spinner/Spinner'
import Template from './src/containers/Template/Template'
import settingsReducer from './src/store/reducers/settings'
import { initApp } from './src/db'

const rootReducer = combineReducers({
	settings: settingsReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

class App extends Component {
	state = { ready: false }

	async componentDidMount() {
		await loadAsync({
			'Lato-Light': require('./src/assets/fonts/Lato-Light.ttf'),
			'Lato-Regular': require('./src/assets/fonts/Lato-Regular.ttf'),
			'Lato-Bold': require('./src/assets/fonts/Lato-Bold.ttf'),
		})

		// Set default styles for all Text components.
		const customTextProps = {
			style: { fontFamily: 'Lato-Regular' },
		}
		setCustomText(customTextProps)

		initApp(() => {
			this.setState({ ready: true })
		})
	}

	render() {
		const { ready } = this.state
		// Hide yellow boxes
		LogBox.ignoreAllLogs(true)

		return ready ? (
			<Provider store={store}>
				<Template>
					<Router />
					<FlashMessage style={{ zIndex: 1000 }} position='bottom' animated={true} />
				</Template>
			</Provider>
		) : (
			<Spinner color='#000' size={64} />
		)
	}
}

export default App
