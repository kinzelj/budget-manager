import { combineReducers } from 'redux';

const dataReducer = function (state = {}, action) {
    switch (action.type) {
        case 'fetch-data': {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}

const settingsReducer = function (state = {}, action) {
    switch (action.type) {
        case 'fetch-settings': {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}

export default combineReducers({
    data: dataReducer,
    settings: settingsReducer
})