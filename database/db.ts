import * as Sentry from 'sentry-expo'
import { openDatabase } from 'expo-sqlite'
import AsyncStorage from '@react-native-community/async-storage'
import { expo } from '../app.json'
import { getLocale } from '../src/common/utility'
import logEvent from '../src/common/logEvent'

export const VERSION = expo.version
export const db = openDatabase('savefood.db', VERSION)

export const initDatabase = (callback: () => void) => {
	db.transaction(
		(tx) => {
			// tx.executeSql(
			//     'DROP TABLE IF EXISTS wasted_food;'
			// );
			tx.executeSql(
				'create table if not exists wasted_food (id integer primary key not null, name text, image text, quantity integer, price integer, percentage integer, paid integer, productQuantity integer, quantitySuffixIndex integer DEFAULT 0, selected integer DEFAULT 1);',
			)
			tx.executeSql(
				'create table if not exists settings (id integer primary key not null, lang text, currency text, notification_cycle integer, email text, version text);',
			)
			tx.executeSql(
				'INSERT OR IGNORE INTO settings (id, lang, currency, notification_cycle, email, version) values (0, ?, ?, ?, ?, ?);',
				[getLocale().lang, getLocale().currency, 0, '', `${VERSION}_INIT`],
				() => {
					setupDatabase(callback)
				},
			)
		},
		(err) => {
			Sentry.Native.captureException(err)
			// eslint-disable-next-line no-console
			console.error(err)
		},
	)
}

export const setupDatabase = (callback: () => void) => {
	// initDatabase();
	db.transaction(
		(tx) => {
			// CHECK CORRECTION APP VERSION AND UPDATE DB
			tx.executeSql('select * from settings', [], (_, { rows }) => {
				const { version } = rows.item(0)

				if (version !== VERSION) {
					if (version.includes('_INIT')) {
						logEvent('firstSetup', {
							name: 'startedApp',
						})

						AsyncStorage.setItem('start', 'true')
						tx.executeSql(
							'UPDATE settings SET lang = ?, currency = ?, version = ? WHERE id = 0;',
							[getLocale().lang, getLocale().currency, VERSION],
							() => {
								callback()
							},
						)
					} else {
						// const versionID = +version.split('.').join("");
						tx.executeSql('UPDATE settings SET version = ? WHERE id = 0;', [VERSION], () => {
							callback()
						})
					}
				} else callback()
			})
		},
		(err) => {
			// eslint-disable-next-line no-console
			console.log(err)
			initDatabase(callback)
		},
	)
}
