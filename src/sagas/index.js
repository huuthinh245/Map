import { all, fork } from 'redux-saga/effects';
import mapSaga from './mapSaga';
import categorySaga from './categorySaga';
export default function* rootSaga(){
  yield all([fork(mapSaga), fork(categorySaga)])
}
