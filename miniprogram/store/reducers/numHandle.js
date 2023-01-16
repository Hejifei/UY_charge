import {
    ADD,
    MINUS,
    SET_VALUE,
  } from '../constants/actionTypes'
  
  const defaultState = {
    count: 0
  }
  
  export const numHandle = (state = defaultState, action) => {
    switch (action.type) {
      case ADD:
        return { ...state, count: state.count + 1 };
      case MINUS:
        return { ...state, count: state.count - 1 };
      case SET_VALUE:
        return {
            ...state,
            count: action.value,
        }
      default:
        return state;
    }
}