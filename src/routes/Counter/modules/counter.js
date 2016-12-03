import { combineEpics } from 'redux-observable'

// ------------------------------------
// Actions
// ------------------------------------
export const COUNTER_INCREMENT = 'COUNTER_INCREMENT'

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
};

export const DOUBLE_OBS = 'DOUBLE_OBS'

export function doubleObs () {

  return {
    type: DOUBLE_OBS
  }
}

//A tick, normally received from socket.io
export const TICK = 'TICK'

export function tick(tick) {

  return {
    type: TICK,
    payload: {
      tick
    }
  }
}

export const actions = {
  tick,
  increment,
  doubleAsync,
  doubleObs
};

const initialState = 0;

// ------------------------------------
// Epic
// ------------------------------------
export const epic = combineEpics(

  //Async click of Double button, with a delay
  action$ => action$.delay(1000).ofType(DOUBLE_OBS).map(action => {
    return increment(-1);
  }),

  //Received (usually) from socket.io tick - map to incrementing.
  action$ => action$.ofType(TICK).map(action => {
    return increment(1);
  })
);

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [COUNTER_INCREMENT] : (state, action) => state + action.payload
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function (state = initialState, action) {

  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state
}



