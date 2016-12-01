import {combineEpics} from "redux-observable/lib/combineEpics";

// ------------------------------------
// Constants
// ------------------------------------
export const COUNTER_INCREMENT = 'COUNTER_INCREMENT'

// ------------------------------------
// Actions
// ------------------------------------
export function increment (value = 1) {
  return {
    type    : COUNTER_INCREMENT,
    payload : value
  }
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk!

    NOTE: This is solely for demonstration purposes. In a real application,
    you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
    reducer take care of this logic.  */

export const doubleAsync = () => {
  console.log('dbl async')
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(increment(getState().counter))
        resolve()
      }, 200)
    })
  }
}

export const DOUBLE_OBS = 'DOUBLE_OBS'

export function doubleObs () {

  return {
    type: DOUBLE_OBS
  }
}

export const actions = {
  increment,
  doubleAsync,
  doubleObs
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [COUNTER_INCREMENT] : (state, action) => state + action.payload
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = 0
export default function counterReducer (state = initialState, action) {

  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

export const counterEpic = action$ => action$.delay(1000).ofType(DOUBLE_OBS).map(action => {
  return increment(-1);
});

