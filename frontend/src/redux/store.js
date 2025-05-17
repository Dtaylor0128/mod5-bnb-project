import {
    legacy_createStore as createStore,
    applyMiddleware,
    compose,
    combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';

const rootReducer = combineReducers({
    session: sessionReducer,
    // add other reducers here
});
// Set up the Redux store with middleware
let enhancer;
if (import.meta.env.MODE === 'production') {
    enhancer = applyMiddleware(thunk);
} else { // Enable the Redux DevTools Extension in development mode
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
    compose;
    enhancer = composeEnhancers(applyMiddleware(thunk));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};
// Create the store
const store = configureStore();
// Export the store for use in the app
export default store;