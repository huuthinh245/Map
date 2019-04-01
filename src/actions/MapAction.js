import * as types from './types';


const getDataMapAction = ( { lat, lng, keyword }) => ({
  type: types.GET_DATA,
  payload: { lat, lng, keyword }
})

const getDataWithCategoryAction = ({ lat, lng, danhmucID }) => ({
  type: types.DATA_FROM_CATEGORY,
  payload: { lat, lng, danhmucID }
})

const clearDataAction = () => ({
  type: types.CLEAR_DATA,
})

const clearDataCategoryAction = () => ({
  type: types.CLEAR_CATEGORY_DATA
});

export {
getDataMapAction,
clearDataAction,
getDataWithCategoryAction,
clearDataCategoryAction
}
