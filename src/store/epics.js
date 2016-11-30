import { combineEpics } from 'redux-observable'
import 'rxjs'

export const makeRootEpic = (asyncEpics) => {
  return asyncEpics ? combineEpics(...asyncEpics) : combineEpics()
}

export const injectEpic = (store, { key, epic }) => {

  if(!store.epicMiddleware.asyncEpics) store.epicMiddleware.asyncEpics = {};

  store.epicMiddleware.asyncEpics[key] = epic;
  store.epicMiddleware.replaceEpic(makeRootEpic(store.epicMiddleware.asyncEpics))
}

export default makeRootEpic
