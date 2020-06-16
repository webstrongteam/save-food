import * as actionTypes from './actionTypes';
import {openDatabase} from 'expo-sqlite';

const db = openDatabase('savefood.db');

export const onUpdateWastedFood = (wastedFood) => {
    return {
        type: actionTypes.UPDATE_WASTED_FOOD,
        wastedFood
    }
};

export const fetchWastedFood = (callback = () => null) => {
    return dispatch => {
        db.transaction(
            tx => {
                tx.executeSql('select * from wasted_food where paid = 0 ;', [], (_, {rows}) => {
                    callback(rows._array);
                    dispatch(onUpdateWastedFood(rows._array));
                });
            }, (err) => console.log(err)
        );
    };
};

export const fetchAllWastedFood = (callback = () => null) => {
    return dispatch => {
        db.transaction(
            tx => {
                tx.executeSql('select * from wasted_food;', [], (_, {rows}) => {
                    callback(rows._array);
                    dispatch(onUpdateWastedFood(rows._array));
                });
            }, (err) => console.log(err)
        );
    };
};

export const saveFood = (food, callback = () => null) => {
    return dispatch => {
        if (food.id) {
            db.transaction(
                tx => {
                    tx.executeSql(`update wasted_food
                                   set name            = ?,
                                       image           = ?,
                                       quantity        = ?,
                                       price           = ?,
                                       percentage      = ?,
                                       productQuantity = ?,
                                       paid            = ?
                                   where id = ?;`, [food.name, food.image, food.quantity, food.price, food.percentage, food.productQuantity, food.paid, food.id], () => {
                        callback();
                        dispatch(fetchWastedFood());
                    });
                }, (err) => console.log(err)
            );
        } else {
            db.transaction(
                tx => {
                    tx.executeSql('insert into wasted_food (name, image, quantity, price, percentage, productQuantity, paid) values (?,?,?,?,?,?,?)', [food.name, food.image, food.quantity, food.price, food.percentage, food.productQuantity, food.paid], () => {
                        callback();
                        dispatch(fetchWastedFood());
                    });
                }, (err) => console.log(err)
            );
        }
    };
};

export const removeFood = (id, callback = () => null) => {
    return dispatch => {
        db.transaction(
            tx => {
                tx.executeSql('delete from wasted_food where id = ?', [id], () => {
                    callback();
                    dispatch(fetchWastedFood());
                });
            }, (err) => console.log(err)
        );
    }
};