import { takeLatest, put, call } from 'redux-saga/effects';
import { categoryApi } from '../api/ApiMap';
import * as types from '../actions/types';


function* categorySaga() {
  try {
    const response = yield call(categoryApi);
    const  { status, data } = response;
    if (status === 200){
      yield put({ type: types.GET_CATEGORY_SUCCESS, payload: { data: data.resultObject } });
    } else {
      yield put({ type: types.GET_CATEGORY_ERROR });
    }
  } catch (error) {
    yield put({ type: types.GET_CATEGORY_ERROR });
  }
 

}

export default function* watchCategorySaga(){
  yield takeLatest(types.GET_CATEGORY, categorySaga)
}
