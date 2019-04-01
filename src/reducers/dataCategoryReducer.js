import * as types from '../actions/types';
import Immutable from 'immutable';


const initialState = Immutable.fromJS({
  loading: false,
  categoryId: null,
  list_data: []
});

const categoryDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.DATA_FROM_CATEGORY:
      return state.merge({ loading: true });
    case types.DATA_FROM_CATEGORY_SUCCESS: {
      const data = action.payload.data.map(
        item => Object.assign(item, { location: { longitude: Number(item.Long), latitude: Number(item.Lat) } })
      );
      return state.merge({ loading: false, categoryId: action.payload.danhmucID, list_data: data  });
    }
    case types.DATA_FROM_CATEGORY_ERROR:
      return state.merge({ loading: false });
    case types.CLEAR_CATEGORY_DATA: 
      return state.merge({ list_data: [], categoryId: '' });
    default:
      return state;
  }
}

export default categoryDataReducer;
