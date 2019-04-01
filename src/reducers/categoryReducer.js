import * as types from '../actions/types';
import Immutable from 'immutable';


const initialState = Immutable.fromJS({
  loading: false,
  category: Immutable.Map({}),
});

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_CATEGORY:
      return state.set('loading', true);
    case types.GET_CATEGORY_SUCCESS: {
      const newObj = Object.assign({}, state.category);
      action.payload.data.map(item => Object.assign(newObj, { [item.DanhMucId]: item }));
      return state.merge({ loading: false }).merge({ category: newObj });
    }
    case types.GET_CATEGORY_ERROR:
      return state.merge({ loading: false });
    default:
      return state;
  }
}

export default categoryReducer;
