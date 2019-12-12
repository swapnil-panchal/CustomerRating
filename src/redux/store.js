import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './reducer';
import * as reduxLoop from 'redux-loop-symbol-ponyfill';
import middleware from './middleware';
import createSagaMiddleware from 'redux-saga'
import rootSagas from '../sagas';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const enhancers = [
    applyMiddleware(...middleware, sagaMiddleware),
    reduxLoop.install()
];

const composeEnhancers = (
    __DEV__ &&
    typeof (window) !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose;

const enhancer = composeEnhancers(...enhancers);

const store = createStore(
    reducer,
    null,
    enhancer
);
// then run the saga
sagaMiddleware.run(rootSagas)
export default store;