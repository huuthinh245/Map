
import React, { createContext } from 'react';
import { withNavigation } from 'react-navigation';
export const MapContext = createContext();

class MapProvider extends React.Component {

  openDrawer = () => {
    this.props.navigation.openDrawer();
  }

  openSearch = () => {
    this.props.navigation.navigate({ routeName: 'SearchScreen' });
  }
  render() {
    return (
      <MapContext.Provider value={{ openDrawer: this.openDrawer, openSearch: this.openSearch }}>
        {this.props.children}
      </MapContext.Provider>
    )
  }
}
export default withNavigation(MapProvider);
