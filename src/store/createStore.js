import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import {makeRootReducer, injectReducer} from './reducers'
import { updateLocation } from './location'

//RxJS integration
import makeRootEpic from './epics'
import { createEpicMiddleware } from 'redux-observable'

//Socket.io integration
import io from 'socket.io-client'
import createSocketIoMiddleware from 'redux-socket.io'

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================

  const rootEpic = makeRootEpic();

  const epicMiddleware = createEpicMiddleware(rootEpic);

  const socket = io();
  const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

  const middleware = [thunk, epicMiddleware, socketIoMiddleware];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []

  let composeEnhancers = compose

  if (__DEV__) {
    const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension
    }
  }


  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );
  store.asyncReducers = {}

  store.epicMiddleware = epicMiddleware;

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  if (module.hot) {

    module.hot.accept('./epics', () => {
      const epics = require('./epics').default;
      epicMiddleware.replaceEpic(epics(epicMiddleware.asyncEpics));
    });

    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  return store
}
