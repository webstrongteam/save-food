import React, { useEffect, useState } from 'react'
import FlashMessage from 'react-native-flash-message'
import { useFonts } from 'expo-font'
import { setCustomText } from 'react-native-global-props'
import Router from './src/router'
import Spinner from './src/components/Spinner/Spinner'
import Template from './src/components/Template/Template'
import { SettingsContextProvider } from './src/common/context/SettingsContext'
import { setupDatabase } from './database/db'
import sentryConfig from './src/config/sentry'
import logEvent from './src/common/logEvent'
import { logConfigStatus } from './src/common/utility'

export default function App() {
	const [loading, setLoading] = useState<boolean>(true)

	const [loaded] = useFonts({
		'Lato-Light': require('./src/assets/fonts/Lato-Light.ttf'),
		'Lato-Regular': require('./src/assets/fonts/Lato-Regular.ttf'),
		'Lato-Bold': require('./src/assets/fonts/Lato-Bold.ttf'),
	})

	useEffect(() => {
		if (loaded) {
			initApp()
		}
	}, [loaded])

	const initApp = () => {
		// Set default styles for all Text components.
		const customTextProps = {
			style: { fontFamily: 'Lato-Regular' },
		}
		setCustomText(customTextProps)

		sentryConfig()
		logConfigStatus()

		setupDatabase(() => {
			logEvent('successStartedApp', {
				name: 'startedApp',
			})

			setLoading(false)
		})
	}

	if (loading) {
		return <Spinner size={64} />
	}

	return (
		<SettingsContextProvider>
			<Template>
				<Router />
				<FlashMessage style={{ zIndex: 1000 }} position='bottom' animated />
			</Template>
		</SettingsContextProvider>
	)
}
