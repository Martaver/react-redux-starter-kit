import { combineEpics } from 'redux-observable'
import 'rxjs'

export const makeRootEpic = (asyncEpics) => {

  return asyncEpics ? combineEpics(...asyncEpics) : combineEpics()
}

export const injectEpic = (store, { key, epic }) => {

  if(!store.epicMiddleware.asyncEpics) store.epicMiddleware.asyncEpics = {};

  store.epicMiddleware.asyncEpics[key] = epic;
  var epics = Object.keys(store.epicMiddleware.asyncEpics).map(key => store.epicMiddleware.asyncEpics[key]);
  let rootEpic = makeRootEpic(epics);
  store.epicMiddleware.replaceEpic(rootEpic)
}

export default makeRootEpic
