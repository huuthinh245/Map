import * as types from '../actions/types';
import Immutable from 'immutable';
const initialState = Immutable.fromJS({
  loading: false,
  keyword: '',
  data: [],
  dataFilter: Immutable.Map({}),
});

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DATA:
      return state.merge({ loading: true, keyword: action.payload.keyword });
    case types.GET_DATA_SUCCESS: {
      const data = action.payload.data.map(
        item => Object.assign(item, { location: { longitude: Number(item.Long), latitude: Number(item.Lat) } })
      );
      state = initialState;
      return state.merge({ data: data, loading: false, keyword: action.payload.keyword });
    }
    case types.GET_DATA_ERROR:
      return state.merge({ loading: false, keyword: action.payload.keyword });
    case types.PICK_DATA:
    case types.CLEAR_DATA:
      return state.merge({ keyword: '', data: [] });
    default:
      return state;
  }
}

export default mapReducer;
