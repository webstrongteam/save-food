import * as Analytics from 'expo-firebase-analytics'
import * as Sentry from 'sentry-expo'
import { WastedFood } from '../../src/types/westedFood'
import { db } from '../db'
import { getAllResults } from '../../src/common/utility'

export const fetchWastedFood = (): Promise<WastedFood[]> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from wasted_food where paid = 0;', [], (_, { rows }) => {
					resolve(getAllResults<WastedFood>(rows))
				})
			},
			(err) => {
				Sentry.Native.captureException(err)
				reject(err)
			},
		)
	})

export const fetchAllWastedFood = (): Promise<WastedFood[]> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from wasted_food;', [], (_, { rows }) => {
					resolve(getAllResults<WastedFood>(rows))
				})
			},
			(err) => {
				Sentry.Native.captureException(err)
				reject(err)
			},
		)
	})

export const saveFood = (food: Partial<WastedFood>): Promise<{}> =>
	new Promise((resolve, reject) => {
		if (food.id) {
			db.transaction(
				(tx) => {
					tx.executeSql(
						`update wasted_food
                                   set name            = ?,
                                       image           = ?,
                                       quantity        = ?,
                                       price           = ?,
                                       percentage      = ?,
                                       productQuantity = ?,
                                       quantitySuffixIndex = ?,
																			 paid            = ?,
                                       selected        = ?
                                   where id = ?;`,
						[
							food.name,
							food.image,
							food.quantity,
							food.price,
							food.percentage,
							food.productQuantity,
							food.quantitySuffixIndex,
							food.paid,
							food.selected,
							food.id,
						],
						() => {
							Analytics.logEvent('updateFood', {
								name: 'wastedFoodAction',
							})

							resolve()
						},
					)
				},
				(err) => {
					Sentry.Native.captureException(err)
					reject(err)
				},
			)
		} else {
			db.transaction(
				(tx) => {
					tx.executeSql(
						'insert into wasted_food (name, image, quantity, price, percentage, productQuantity, quantitySuffixIndex, paid) values (?,?,?,?,?,?,?,?)',
						[
							food.name,
							food.image,
							food.quantity,
							food.price,
							food.percentage,
							food.productQuantity,
							food.quantitySuffixIndex,
							food.paid,
						],
						() => {
							Analytics.logEvent('createFood', {
								name: 'wastedFoodAction',
							})

							resolve()
						},
					)
				},
				(err) => {
					Sentry.Native.captureException(err)
					reject(err)
				},
			)
		}
	})

export const selectFood = (id: number, selected: number): Promise<{}> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update wasted_food set selected = ? where id = ?;', [selected, id], () => {
					resolve()
				})
			},
			(err) => {
				Sentry.Native.captureException(err)
				reject(err)
			},
		)
	})

export const paidFood = (id: number): Promise<{}> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update wasted_food set paid = 1 where id = ?;', [id], () => {
					Analytics.logEvent('paidFood', {
						name: 'wastedFoodAction',
					})

					resolve()
				})
			},
			(err) => {
				Sentry.Native.captureException(err)
				reject(err)
			},
		)
	})

export const removeFood = (id: number): Promise<{}> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('delete from wasted_food where id = ?;', [id], () => {
					Analytics.logEvent('removeFood', {
						name: 'wastedFoodAction',
					})

					resolve()
				})
			},
			(err) => {
				Sentry.Native.captureException(err)
				reject(err)
			},
		)
	})
