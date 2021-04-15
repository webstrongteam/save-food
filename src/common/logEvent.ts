/* eslint-disable no-console */
import * as Analytics from 'expo-firebase-analytics'
import * as Sentry from 'sentry-expo'
import config from '../config/config'

const logEvent = async (name: string, properties?: { [key: string]: any }) => {
	if (config.SETUP_ANALYTICS) {
		try {
			await Analytics.logEvent(name, properties)
		} catch (err) {
			if (!err.message.includes('Firebase is not configured.')) {
				Sentry.Native.captureException(err)
			}
		}
	} else {
		console.info(`Event log name: ${name}`)
	}
}

export default logEvent
