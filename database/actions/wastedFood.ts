import { WastedFood } from '../../src/types/westedFood'
import { db } from '../db'
import { getAllResults } from '../../src/common/utility'
import { sentryError } from '../../src/common/sentryEvent'
import logEvent from '../../src/common/logEvent'

export const fetchWastedFood = (): Promise<WastedFood[]> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from wasted_food where paid = 0;', [], (_, { rows }) => {
					resolve(getAllResults<WastedFood>(rows))
				})
			},
			(err) => {
				sentryError(err)
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
				sentryError(err)
				reject(err)
			},
		)
	})

export const getPaidWastedFoods = (): Promise<WastedFood[]> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from wasted_food where paid = 1;', [], (_, { rows }) => {
					resolve(getAllResults<WastedFood>(rows))
				})
			},
			(err) => {
				sentryError(err)
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
							logEvent('updateFood', {
								name: 'wastedFoodAction',
							})

							resolve()
						},
					)
				},
				(err) => {
					sentryError(err)
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
							logEvent('createFood', {
								name: 'wastedFoodAction',
							})

							resolve()
						},
					)
				},
				(err) => {
					sentryError(err)
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
				sentryError(err)
				reject(err)
			},
		)
	})

export const paidFood = (id: number): Promise<{}> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('update wasted_food set paid = 1 where id = ?;', [id], () => {
					logEvent('paidFood', {
						name: 'wastedFoodAction',
					})

					resolve()
				})
			},
			(err) => {
				sentryError(err)
				reject(err)
			},
		)
	})

export const removeFood = (id: number): Promise<{}> =>
	new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql('delete from wasted_food where id = ?;', [id], () => {
					logEvent('removeFood', {
						name: 'wastedFoodAction',
					})

					resolve()
				})
			},
			(err) => {
				sentryError(err)
				reject(err)
			},
		)
	})
