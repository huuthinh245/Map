import React from 'react';
import { connect } from 'react-redux';
import SearchView from './SearchView';
import { selectors } from '../../selectors/mapSelector';
import { getDataMapAction, clearDataAction, getDataWithCategoryAction } from '../../actions/MapAction';
class SearchContainer extends React.Component {
  componentDidMount() {
    
  }

  componentWillUnmount() {

  }
  render() {
    return (
      <SearchView {...this.props} />
    )
  }
}

const mapStateToProps = (state) => ({
  data: selectors.getData(state),
  keyword: selectors.getKeyword(state),
  loading: selectors.getLoading(state),
  category: selectors.getCategory(state)
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: ({ lat, lng, keyword }) => dispatch(getDataMapAction({ lat, lng, keyword })),
  clearData: () => dispatch(clearDataAction()),
  getDataWithCategory: ({ lat, lng, danhmucID }) => dispatch(getDataWithCategoryAction({ lat, lng, danhmucID })) 
});


export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
