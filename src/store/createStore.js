import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createEpicMiddleware } from 'redux-observable'
import { browserHistory } from 'react-router'
import makeRootReducer from './reducers'
import makeRootEpic from './epics'
import { updateLocation } from './location'

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================

  const rootEpic = makeRootEpic();

  const epicMiddleware = createEpicMiddleware(rootEpic);

  const middleware = [thunk, epicMiddleware];

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
  )
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
