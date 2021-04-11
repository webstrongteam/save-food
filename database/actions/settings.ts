import * as Sentry from 'sentry-expo'
import { Currency, Language, Settings } from '../../src/types/settings'
import { db } from '../db'
import { getLocale } from '../../src/common/utility'
import logEvent from '../../src/common/logEvent'

export const getSettings = (): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from settings;', [], (_, { rows }) => {
					resolve(rows.item(0))
				})
			},
			(err) => {
				Sentry.Native.captureException(err)
				reject(err)
			},
		)
	})

export const changeLang = (lang: Language): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set lang = ? where id = 0;', [lang], () => {
					logEvent('changeLang', {
						name: 'settingsAction',
					})

					try {
						resolve(getSettings())
					} catch (err) {
						Sentry.Native.captureException(err)
						reject(err)
					}
				})
			},
			(err) => {
				Sentry.Native.captureException(err)
				reject(err)
			},
		)
	})

export const changeCurrency = (currency: Currency): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set currency = ? where id = 0;', [currency], () => {
					logEvent('changeCurrency', {
						name: 'settingsAction',
					})

					try {
						resolve(getSettings())
					} catch (err) {
						Sentry.Native.captureException(err)
						reject(err)
					}
				})
			},
			(err) => {
				Sentry.Native.captureException(err)
				reject(err)
			},
		)
	})

export const changeEmail = (email: string): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update settings set email = ? where id = 0;', [email], () => {
					logEvent('changeEmail', {
						name: 'settingsAction',
					})

					try {
						resolve(getSettings())
					} catch (err) {
						Sentry.Native.captureException(err)
						reject(err)
					}
				})
			},
			(err) => {
				Sentry.Native.captureException(err)
				reject(err)
			},
		)
	})

export const clearDatabase = (): Promise<Settings> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(
					'update settings set lang = ?, currency = ?, email = ? where id = 0;',
					[getLocale().lang, getLocale().currency, ''],
					() => {
						tx.executeSql('DROP TABLE IF EXISTS wasted_food;')
						tx.executeSql(
							'create table if not exists wasted_food (id integer primary key not null, name text, image text, quantity integer, price integer, percentage integer, paid integer, productQuantity integer, quantitySuffixIndex integer DEFAULT 0, selected integer DEFAULT 1);',
						)

						logEvent('clearDatabase', {
							name: 'settingsAction',
						})

						try {
							resolve(getSettings())
						} catch (err) {
							Sentry.Native.captureException(err)
							reject(err)
						}
					},
				)
			},
			(err) => {
				Sentry.Native.captureException(err)
				reject(err)
			},
		)
	})
