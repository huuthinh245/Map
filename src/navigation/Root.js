
import {
  StatusBar,
  Animated,
  Platform,
  Easing
} from 'react-native';
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import MapContainer from '../screens/Maps/MapContainer';
import SearchContainer from '../screens/Search/SearchContainer';
import Drawer from './CustomDrawer';

const SearchStack = createStackNavigator({
  Map: {
    screen: MapContainer,
  }
}, {
    mode: 'modal',
    headerMode: 'none',
    defaultNavigationOptions: {
      headerStyle: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        height: 56 + Platform.select({ 'android': StatusBar.currentHeight, 'ios': 0 }),
      },
      // gesturesEnabled: true,
    },
  });


const DrawerNavigator = createDrawerNavigator({
  SearchStack: {
    screen: SearchStack,
  },
}, {
    contentComponent: Drawer,
  });

const AppNavigator = createStackNavigator({
  App: {
    screen: DrawerNavigator
  },
  SearchScreen: {
    screen: SearchContainer,
  }
}, {
    headerMode: 'none',
    defaultNavigationOptions: {
      headerStyle: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        height: 56 + Platform.select({ 'android': StatusBar.currentHeight, 'ios': 0 }),
      },
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        // const height = layout.initHeight;
        // const translateY = position.interpolate({
        //   inputRange: [index - 1, index, index + 1],
        //   outputRange: [height, 0, 0],
        // });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.5, index],
          outputRange: [0, 0.5, 1],
        });

        return { opacity, };
      },
    }),
  })


export default createAppContainer(AppNavigator);
