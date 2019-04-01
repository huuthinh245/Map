// @flow
import { AppRegistry, Platform } from 'react-native';
import * as RNPermissions from 'react-native-permissions';
import App from './App';
import { name as appName } from './app.json';
console.disableYellowBox = true;

// const requestPermissions = async () => {
//   await RNPermissions.request(
//     Platform.select({
//       android: RNPermissions.ANDROID_PERMISSIONS.ACCESS_FINE_LOCATION,
//       ios: RNPermissions.IOS_PERMISSIONS.LOCATION_WHEN_IN_USE
//     })
//   );
// }

// requestPermissions();
AppRegistry.registerComponent(appName, () => App);
