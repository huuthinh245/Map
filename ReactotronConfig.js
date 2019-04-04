import sagaPlugin from 'reactotron-redux-saga';
import Reactotron from 'reactotron-react-native';
import apisaucePlugin from 'reactotron-apisauce';

const reactotron = Reactotron.
configure({ name: 'ExampleMaps'})
.use(sagaPlugin())
.use(apisaucePlugin({
  // ignoreContentTypes: /^(image)\/.*$/i   // <--- a way to skip printing the body of some requests (default is any image)
}))
.connect()
// if (__DEV__) {
//   Reactotron.connect()
//   Reactotron.clear()
// }

Reactotron.onCustomCommand('test', () => console.tron.log('This is an example'));
export default reactotron;
