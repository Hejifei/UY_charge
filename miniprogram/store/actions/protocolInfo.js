import store from '../index'

import { 
    SET_CHARGER_INFO,
    CLEAR_CHARGER_INFO,
} from '../constants/actionTypes';

export function setChargerInfo (value) {
    store.dispatch({
        type: SET_CHARGER_INFO,
        value,
    })
}

export function clearChargerInfo(){
  store.dispatch({
    type: CLEAR_CHARGER_INFO
  })
}