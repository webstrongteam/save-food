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
                tx.executeSql('select * from wasted_food where paid = 0;', [], (_, {rows}) => {
                    callback(rows._array[0]);
                    dispatch(onUpdateWastedFood(rows._array[0]));
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
                    callback(rows._array[0]);
                    dispatch(onUpdateWastedFood(rows._array[0]));
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
                                   set name       = ?,
                                       image      = ?,
                                       quantity   = ?,
                                       price      = ?,
                                       percentage = ?,
                                       paid       = ?
                                   where id = ?;`, [food.name, food.image, food.quantity, food.price, food.percentage, food.paid, food.id], () => {
                        callback();
                    });
                }, (err) => console.log(err)
            );
        } else {
            db.transaction(
                tx => {
                    tx.executeSql('insert into wasted_food (name, image, quantity, price, percentage, paid) values (?,?,?,?,?,?)', [food.name, food.image, food.quantity, food.price, food.percentage, food.paid], () => {
                        callback();
                    });
                }, (err) => console.log(err)
            );
        }
    };
};