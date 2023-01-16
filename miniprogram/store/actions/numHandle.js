import store from '../index'

import { 
  ADD,
  MINUS,
  SET_VALUE,
} from '../constants/actionTypes';

export function setNumHandleInitValue (value) {
    store.dispatch({
        type: SET_VALUE,
        value,
    })
}

export function add(){
  store.dispatch({
    type: ADD
  })
}
export function minus(){
  store.dispatch({
    type: MINUS
  })
}
export function asyncAdd(){
  setTimeout(() => {
    add()
  }, 2000)
}