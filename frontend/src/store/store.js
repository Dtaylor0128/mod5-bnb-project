//import { applyMiddleware, compose, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
//import logger from 'redux-logger';

import spotsReducer from './spots';
import reviewsReducer from './reviews';
import sessionReducer from './session';
import spotImageReducer from './images';

const store = configureStore({
  reducer: {
    spots: spotsReducer,
    reviews: reviewsReducer,
    session: sessionReducer
    //images: spotImageReducer
  }
});

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


// const configureStore = () => {
//   return configureStore({
//     reducer: {
//       session: sessionReducer,
//       spots: spotsReducer,
//       reviews: reviewsReducer // 👈 Critical fix for "bySpotId" error
//     },

//   });
// };

// let enhancer;
// if (import.meta.env.MODE === "production") {
//   enhancer = applyMiddleware(thunk);
// } else {
//   const logger = (await import("redux-logger")).default;
//   const composeEnhancers =
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//   enhancer = composeEnhancers(applyMiddleware(thunk, logger));
// }



//export default createStore;
export default store;
