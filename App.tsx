// @ts-ignore
import { ModalPortal } from 'react-native-modals'
import React, { useEffect, useState } from 'react'
import * as Analytics from 'expo-firebase-analytics'
import FlashMessage from 'react-native-flash-message'
import { useFonts } from 'expo-font'
import { setCustomText } from 'react-native-global-props'
import Router from './src/router'
import Spinner from './src/components/Spinner/Spinner'
import Template from './src/components/Template/Template'
import { SettingsContextProvider } from './src/common/context/SettingsContext'
import { setupDatabase } from './database/db'
import sentryConfig from './src/config/sentry'

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

		setupDatabase(() => {
			Analytics.logEvent('successStartedApp', {
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
				<ModalPortal />
				<FlashMessage style={{ zIndex: 1000 }} position='bottom' animated />
			</Template>
		</SettingsContextProvider>
	)
}
