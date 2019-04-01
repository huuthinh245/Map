import { takeLatest, put, call } from 'redux-saga/effects';
import { mapApi } from '../api/ApiMap';
import * as types from '../actions/types';

function* getMapDataSaga({ payload }) {
  const { lat, lng, keyword } = payload;
  try {
    const response = yield call(mapApi, { lat, lng, keyword });
    const  { status, data } = response;
    if (status === 200){
      yield put({ type: types.GET_DATA_SUCCESS, payload: { data: data.resultObject, keyword } });
    } else {
      yield put({ type: types.GET_DATA_ERROR, payload: { keyword } });
    }
  } catch (error) {
    yield put({ type: types.GET_DATA_ERROR, payload: { keyword } });
  }

}

function* getDataFromCategorySaga ({ payload }) {
  const { lat, lng, danhmucID } = payload;
  try {
    const response = yield call(mapApi, { lat, lng, danhmucID });
    const  { status, data } = response;
    if (status === 200){
      yield put({ type: types.DATA_FROM_CATEGORY_SUCCESS, payload: { data: data.resultObject, danhmucID } });
    } else {
      yield put({ type: types.DATA_FROM_CATEGORY_ERROR });
    }
  } catch (error) {
    yield put({ type: types.DATA_FROM_CATEGORY_ERROR });
  }
}

export default function* watchMapSaga(){
  yield takeLatest(types.GET_DATA, getMapDataSaga), 
  yield takeLatest(types.DATA_FROM_CATEGORY, getDataFromCategorySaga)
  
}
