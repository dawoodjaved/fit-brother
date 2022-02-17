import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";

import persistedReducer from "../Redux/reducers/rootReducer";
import firebaseConfig from "../firebase/config";
import { reduxFirestore, getFirestore } from "redux-firestore";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";

export default function configureStore(preloadedState) {
  //const middlewares = [logger, thunk.withExtraArgument({getFirebase, getFirestore})]
  const middlewares = [thunk.withExtraArgument({ getFirebase, getFirestore })];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(
    ...enhancers,
    reduxFirestore(firebaseConfig)
  );

  const store = createStore(
    persistedReducer,
    preloadedState,
    composedEnhancers
  );

  return store;
}
