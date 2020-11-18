import * as actionTypes from './actionTypes'
import * as Analytics from 'expo-firebase-analytics'
import { openDatabase } from 'expo-sqlite'

const db = openDatabase('savefood.db')

export const onUpdateSettings = (settings) => {
	return {
		type: actionTypes.UPDATE_SETTINGS,
		settings,
	}
}

export const initSettings = (callback = () => null) => {
	return (dispatch) => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from settings;', [], (_, { rows }) => {
					callback(rows._array[0])
					dispatch(onUpdateSettings(rows._array[0]))
				})
			},
			// eslint-disable-next-line no-console
			(err) => console.log(err),
		)
	}
}

export const changeLang = (value) => {
	return (dispatch) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set lang = ? where id = 0;', [value], () => {
					Analytics.logEvent('updatedLang', {
						name: 'settingsAction',
					})

					dispatch(initSettings())
				})
			},
			// eslint-disable-next-line no-console
			(err) => console.log(err),
		)
	}
}

export const changeCurrency = (value) => {
	return (dispatch) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set currency = ? where id = 0;', [value], () => {
					Analytics.logEvent('updatedCurrency', {
						name: 'settingsAction',
					})

					dispatch(initSettings())
				})
			},
			// eslint-disable-next-line no-console
			(err) => console.log(err),
		)
	}
}

export const changeNotificationCycle = (value) => {
	return (dispatch) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set notification_cycle = ? where id = 0;', [value], () => {
					Analytics.logEvent('updatedNotification', {
						name: 'settingsAction',
					})

					dispatch(initSettings())
				})
			},
			// eslint-disable-next-line no-console
			(err) => console.log(err),
		)
	}
}
