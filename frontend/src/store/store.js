import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import spotsReducer from './spots'; // Make sure this import exists

const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer // Fixed the trailing colon and added reducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;

// import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
// import thunk from 'redux-thunk';
// import sessionReducer from './session';


// const rootReducer = combineReducers({
//   // ADD REDUCERS HERE
//   session: sessionReducer,
//   spots: spotsReducer
// });

// let enhancer;
// if (import.meta.env.MODE === "production") {
//   enhancer = applyMiddleware(thunk);
// } else {
//   const logger = (await import("redux-logger")).default;
//   const composeEnhancers =
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//   enhancer = composeEnhancers(applyMiddleware(thunk, logger));
// }

// const configureStore = (preloadedState) => {
//   return createStore(rootReducer, preloadedState, enhancer);
// };

// export default configureStore;

// import {
//     legacy_createStore as createStore,
//     applyMiddleware,
//     compose,
//     combineReducers,
// } from 'redux';
// import thunk from 'redux-thunk';
// import sessionReducer from './session';

// const rootReducer = combineReducers({
//     session: sessionReducer,
//     // add other reducers here
// });
// // Set up the Redux store with middleware
// let enhancer;
// if (import.meta.env.MODE === 'production') {
//     enhancer = applyMiddleware(thunk);
// } else { // Enable the Redux DevTools Extension in development mode
//     const composeEnhancers =
//         window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//     enhancer = composeEnhancers(applyMiddleware(thunk, logger));
//     compose;
//     enhancer = composeEnhancers(applyMiddleware(thunk));
// }

// const configureStore = (preloadedState) => {
//     return createStore(rootReducer, preloadedState, enhancer);
// };
// // Create the store
// const store = configureStore();
// // Export the store for use in the app
// export default store;