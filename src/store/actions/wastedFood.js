import { openDatabase } from 'expo-sqlite'
import * as Analytics from 'expo-firebase-analytics'

const db = openDatabase('savefood.db')

export const fetchWastedFood = (callback = () => null) => {
	return () => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from wasted_food where paid = 0 ;', [], (_, { rows }) => {
					callback(rows._array)
				})
			},
			// eslint-disable-next-line no-console
			(err) => console.log(err),
		)
	}
}

export const fetchAllWastedFood = (callback = () => null) => {
	return () => {
		db.transaction(
			(tx) => {
				tx.executeSql('select * from wasted_food;', [], (_, { rows }) => {
					callback(rows._array)
				})
			},
			// eslint-disable-next-line no-console
			(err) => console.log(err),
		)
	}
}

export const saveFood = (food, callback = () => null) => {
	return () => {
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
							food.paid,
							food.selected,
							food.id,
						],
						() => {
							Analytics.logEvent('updatedFood', {
								name: 'wastedFoodAction',
							})

							callback()
						},
					)
				},
				// eslint-disable-next-line no-console
				(err) => console.log(err),
			)
		} else {
			db.transaction(
				(tx) => {
					tx.executeSql(
						'insert into wasted_food (name, image, quantity, price, percentage, productQuantity, paid) values (?,?,?,?,?,?,?)',
						[
							food.name,
							food.image,
							food.quantity,
							food.price,
							food.percentage,
							food.productQuantity,
							food.paid,
						],
						() => {
							Analytics.logEvent('savedFood', {
								name: 'wastedFoodAction',
							})

							callback()
						},
					)
				},
				// eslint-disable-next-line no-console
				(err) => console.log(err),
			)
		}
	}
}

export const selectFood = (id, selected, callback = () => null) => {
	return () => {
		db.transaction(
			(tx) => {
				tx.executeSql('update wasted_food set selected = ? where id = ?', [selected, id], () => {
					callback()
				})
			},
			// eslint-disable-next-line no-console
			(err) => console.log(err),
		)
	}
}

export const paidFood = (id, callback = () => null) => {
	return () => {
		db.transaction(
			(tx) => {
				tx.executeSql('update wasted_food set paid = 1 where id = ?', [id], () => {
					Analytics.logEvent('paidFood', {
						name: 'wastedFoodAction',
					})

					callback()
				})
			},
			// eslint-disable-next-line no-console
			(err) => console.log(err),
		)
	}
}

export const removeFood = (id, callback = () => null) => {
	return () => {
		db.transaction(
			(tx) => {
				tx.executeSql('delete from wasted_food where id = ?', [id], () => {
					Analytics.logEvent('removedFood', {
						name: 'wastedFoodAction',
					})

					callback()
				})
			},
			// eslint-disable-next-line no-console
			(err) => console.log(err),
		)
	}
}
