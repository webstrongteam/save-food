import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../common/store';
import en from "../../translations/en.json";
import pl from "../../translations/pl.json";

const messages = {en, pl};

const initState = {
    translations: messages['en'],
    refresh: false
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

const refresh = (state) => {
    return updateObject(state, {
        refresh: !state.refresh
    });
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_SETTINGS:
            return updateSettings(state, action);
        case actionTypes.REFRESH:
            return refresh(state);
        default:
            return state;
    }
};

export default reducer;