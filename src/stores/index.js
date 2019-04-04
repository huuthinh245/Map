import Reactotron from 'reactotron-react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import  createSagaMiddleware from 'redux-saga';
import sagaPlugin from 'reactotron-redux-saga';
import apisaucePlugin from 'reactotron-apisauce';
import { reactotronRedux } from 'reactotron-redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import Immutable from 'immutable';
import reducer from '../reducers';
import rootSaga from '../sagas';

console.tron = Reactotron;
Reactotron.configure({ name: 'ExampleMaps'})
.useReactNative()
.use(reactotronRedux())
.use(sagaPlugin())
.use(apisaucePlugin({}))
if (__DEV__) {
  Reactotron.connect()
  Reactotron.clear()
}

const sagaMonitor = Reactotron.createSagaMonitor();
const sagaMiddleWare = createSagaMiddleware({
  sagaMonitor
});
const reducers = combineReducers(reducer);
const middleWares = [sagaMiddleWare];
const enhance = composeWithDevTools({})(applyMiddleware(...middleWares));

// const stores = createStore(reducers, Immutable.Map({}), enhance);
const stores = createStore(reducers, Immutable.Map({}), compose(enhance, Reactotron.createEnhancer()))
sagaMiddleWare.run(rootSaga);

export default stores;
