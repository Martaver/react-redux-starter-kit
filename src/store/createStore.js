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
import socketReducer from '../socket/socketReducer'

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================

  const rootEpic = makeRootEpic();

  const epicMiddleware = createEpicMiddleware(rootEpic);

  const socket = io();
  const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

  const middleware = [socketIoMiddleware, thunk, epicMiddleware];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEV__) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }


  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );
  store.asyncReducers = {}

  injectReducer(store, {key: 'socket', reducer: socketReducer});

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
