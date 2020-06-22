import {AsyncStorage, NativeModules, Platform} from "react-native";
import {openDatabase} from 'expo-sqlite';

export const VERSION = '1.0.0'; // APP VERSION
const db = openDatabase('savefood.db', VERSION);

const getLocale = () => {
    const locale =
        Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale
            : NativeModules.I18nManager.localeIdentifier;
    if (locale === 'pl_PL') {
        return {lang: 'pl', currency: 'PLN'};
    } else {
        return {lang: 'en', currency: 'USD'};
    }
};

export const initDatabase = (callback) => {
    db.transaction(tx => {
        // tx.executeSql(
        //     'DROP TABLE IF EXISTS wasted_food;'
        // );
        // tx.executeSql(
        //     'DROP TABLE IF EXISTS settings;'
        // );
        tx.executeSql(
            'create table if not exists wasted_food (id integer primary key not null, name text, image text, quantity integer, price integer, percentage integer, paid integer, productQuantity integer);'
        );
        tx.executeSql(
            'create table if not exists settings (id integer primary key not null, lang text, currency text, notification_cycle integer, version text);'
        );
        tx.executeSql(
            "INSERT OR IGNORE INTO settings (id, lang, currency, notification_cycle, version) values (0, ?, ?, ?, ?);", [getLocale().lang, getLocale().currency, 0, VERSION + '_INIT'], () => {
                initApp(callback);
            }
        );
    }, (err) => console.log(err));
};

export const initApp = (callback) => {
    // initDatabase();
    db.transaction(
        tx => {
            // CHECK CORRECTION APP VERSION AND UPDATE DB
            tx.executeSql("select * from settings", [], (_, {rows}) => {
                const version = rows._array[0].version;

                if (version !== VERSION) {
                    if (version.includes('_INIT')) {
                        AsyncStorage.setItem('start', 'true');
                        tx.executeSql('UPDATE settings SET lang = ?, currency = ?, version = ? WHERE id = 0;', [getLocale().lang, getLocale().currency, VERSION], () => {
                            callback();
                        });
                    } else {
                        //const versionID = +version.split('.').join("");
                        tx.executeSql('UPDATE settings SET version = ? WHERE id = 0;', [VERSION], () => {
                            callback();
                        });
                    }
                } else callback();
            }, () => initDatabase(callback));
        }, (err) => console.log(err)
    );
};