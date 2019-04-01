const reselect = state => key => state.get('mapReducer').toJS()[key];
const reselectCategory = state => key => state.get('categoryReducer').toJS()[key];
const reselectDataCategory = state => key => state.get('dataCategoryReducer').toJS()[key];
export const selectors = {
    getData: state => reselect(state)('data'),
    getLoading: state => reselect(state)('loading'),
    getKeyword: state => reselect(state)('keyword'),
    getCategory: state => reselectCategory(state)('category'),
    getListDataCategory: state => reselectDataCategory(state)('list_data'),
    getCategoryId: state => reselectDataCategory(state)('categoryId')
}
