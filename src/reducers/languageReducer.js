import * as types from '../actions/types';
import Immutable from 'immutable';
import  i18n from '../locales';

const initialState = Immutable.fromJS({
  locales: 'en',
});

const localeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_LOCALE:
      i18n.locale = state.toJS().locales === 'en' ?  'fr' : 'en';
      return state.merge({ locales: state.toJS().locales === 'en' ?  'fr' : 'en'});
    default:
      return state;
  }
}

export default localeReducer;
