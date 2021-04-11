/* eslint-disable no-console */
import * as Analytics from 'expo-firebase-analytics'
import config from '../config/config'

const logEvent = async (name: string, properties?: { [key: string]: any }) => {
	if (config.SETUP_ANALYTICS) {
		await Analytics.logEvent(name, properties)
	} else {
		console.info(`Event log name: ${name}`)
	}
}

export default logEvent
