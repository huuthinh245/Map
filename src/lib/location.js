//@flow
// eslint-disable-next-line react-native/split-platform-components
import { Platform, PermissionsAndroid } from 'react-native';
import * as RNPermissions from 'react-native-permissions';
export default  () => {
  return Platform.OS === 'android' ? getLocationAndroid() : getLocationIos();
}

const getLocationAndroid = async () => {
  return new Promise(async (resolve, reject) => {
    const a = await RNPermissions.check(RNPermissions.ANDROID_PERMISSIONS.ACCESS_FINE_LOCATION);
    const grant = await PermissionsAndroid.check('android.permission.ACCESS_COARSE_LOCATION');
    if (!grant) {
      reject('need permission');
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  })
}

const getLocationIos = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};


