import React, { Component } from 'react';
import {
  Platform
} from 'react-native';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import * as RNPermissions from 'react-native-permissions';
import Root from './src/navigation/Root';
import stores from './src/stores';
import { getDataCategoryAction } from './src/actions/categoryAction';

export default class App extends Component {
  async componentDidMount() {
    await RNPermissions.request(
      Platform.select({
        android: RNPermissions.ANDROID_PERMISSIONS.ACCESS_FINE_LOCATION,
        ios: RNPermissions.IOS_PERMISSIONS.LOCATION_WHEN_IN_USE
      })
    );
    SplashScreen.hide();

    stores.dispatch(getDataCategoryAction());
  }
  render() {
    
    return (
      <Provider store={stores}>
        <Root />
      </Provider>
    );
  }
}
