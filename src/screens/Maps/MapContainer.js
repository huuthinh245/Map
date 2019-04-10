import React from 'react';
import { connect } from 'react-redux';
import MapView from './MapScreen';
import { selectors } from '../../selectors/mapSelector';
import { getDataMapAction,clearDataAction, clearDataCategoryAction } from '../../actions/MapAction';

class MapContainer extends React.Component {
  
    render() {
        return <MapView {...this.props} />
    }
}

const mapStateToProps = (state) => ({
 loading: selectors.getLoading(state),
 data:  selectors.getData(state),
 keyword: selectors.getKeyword(state),
 category: selectors.getCategory(state),
 list_data: selectors.getListDataCategory(state),
 categoryId: selectors.getCategoryId(state),
});

const mapDispatchToProps = (dispatch) => ({
   fetchData: ({ lat, lng, keyword }) => dispatch(getDataMapAction({ lat, lng, keyword })),
   clearData: () => dispatch(clearDataAction()),
   clearDataCategory: () => dispatch(clearDataCategoryAction()),
   setLocale: () => dispatch({ type: 'SET_LOCALE'})
   
});

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
