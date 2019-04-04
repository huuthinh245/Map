// @flow
import { AppRegistry, Platform } from 'react-native';
import * as RNPermissions from 'react-native-permissions';
import App from './App';
import { name as appName } from './app.json';

console.disableYellowBox = true;


AppRegistry.registerComponent(appName, () => App);
