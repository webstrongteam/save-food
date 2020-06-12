import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../common/store';
import en from "../../translations/en/en.json";
import pl from "../../translations/pl/pl.json";

const messages = {en, pl};

const initState = {
    translations: messages['en']
};

const updateSettings = (state, action) => {
    if (action.settings.lang.constructor.name !== 'String') {
        action.settings.lang = 'en'
    }
    return updateObject(state, {
        ...action.settings,
        translations: messages[action.settings.lang]
    });
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_SETTINGS:
            return updateSettings(state, action);
        default:
            return state;
    }
};

export default reducer;