import * as Sentry from 'sentry-expo'
import config from './config'

const sentryConfig = () => {
	if (!config.SETUP_SENTRY) {
		return
	}

	Sentry.init({
		dsn: config.SENTRY_DNS,
		enableInExpoDevelopment: true,
		debug: true,
	})
}

export default sentryConfig
