import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../common/store';

const initState = {
    wastedFood: []
};

const updateSettings = (state, action) => {
    return updateObject(state, {
        ...action.wastedFood
    });
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_WASTED_FOOD:
            return updateSettings(state, action);
        default:
            return state;
    }
};

export default reducer;