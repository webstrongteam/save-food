import * as actionTypes from './actionTypes';
import {openDatabase} from 'expo-sqlite';

const db = openDatabase('template.db');

export const onUpdateSettings = (settings) => {
    return {
        type: actionTypes.UPDATE_SETTINGS,
        settings
    }
};

export const initSettings = (callback = () => null) => {
    return dispatch => {
        db.transaction(
            tx => {
                tx.executeSql('select * from settings;', [], (_, {rows}) => {
                    callback(rows._array[0]);
                    dispatch(onUpdateSettings(rows._array[0]));
                });
            }, (err) => console.log(err)
        );
    };
};

export const changeLang = (value) => {
    return dispatch => {
        db.transaction(
            tx => {
                tx.executeSql('update settings set lang = ? where id = 0;', [value], () => {
                    dispatch(initSettings())
                });
            }, (err) => console.log(err)
        );
    };
};