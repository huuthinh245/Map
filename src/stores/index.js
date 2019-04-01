import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutable';
import  createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import Immutable from 'immutable';
import reducer from '../reducers';
import rootSaga from '../sagas';

const sagaMiddleWare = createSagaMiddleware();
const reducers = combineReducers(reducer);
const middleWares = [sagaMiddleWare];
const enhance = composeWithDevTools({})(applyMiddleware(...middleWares));

const stores = createStore(reducers, Immutable.Map({}), enhance);

sagaMiddleWare.run(rootSaga);

export default stores;
