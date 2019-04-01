//@flow
import React, { createRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Linking
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import type { NavigationScreenProp, NavigationStateRoute } from 'react-navigation';
import Emitter from '../../lib';
import { metrics, alert } from '../../utils';
import CustomMarker from './CustomMarker';
import BottomSheet from './BottomSheet';
import MapViewDirections from './MapViewDirections';
import MapPanel from './MapPanel';
import getLocation from '../../lib/location';

const types = ['standard', 'hybrid', 'satellite'];
const initialRegion = {
  latitude: 10.8855119,
  longitude: 106.5887824,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
}

type State = {
  index: number,
  ready: ?boolean,
  data: Array<any>,
  text: string,
  obj: any,
  mapType: number,
  coordinates: Array<any>
}

type Props = {
  navigation: NavigationScreenProp<NavigationStateRoute>,
  data: any,
  list_data: Array<any>,
  categoryId: number,
  clearData?: () => void,
  clearDataCategory?: () => void,
  keyword: string,
  category: Object
};


class Map extends React.Component<Props, State> {

  panel1: any;
  map: any;

  constructor(props: any) {
    super(props);
    this.state = {
      index: 1,
      ready: false,
      obj: null,
      text: '',
      mapType: 0,
      data: [],
      coordinates: [],
    }
    this.panel1 = createRef();
    this.map = createRef();
  }
  shouldComponentUpdate(nextProps: any, nextState: State) {
    if (nextProps.data !== this.props.data || nextState !== this.state) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    Emitter.addListener('itemClick', this.onItemClick);
    Emitter.addListener('showPanel', this.showPanel);
    Emitter.addListener('showPanelList', this.showPanelList);
  }

  componentWillUnmount() {
    Emitter.removeAllListeners();
  }

  showPanelList = () => {

  }

  onItemClick = (item: any) => {
    // this.panel1.current.snapTo({ index: 2 });
  }

  setRegion = (region: any) => {
    this.map.current.animateToRegion(region, 1000);
  }

  showPanel = (item: Object) => {
    this.setState({
      obj: item,
    });
  }

  show = () => {
    this.props.navigation.openDrawer();
  }

  showFilter = () => {
    this.props.navigation.navigate({ routeName: 'SearchScreen' });
  }



  onMarkerPress = (e: any) => {
    if (this.state.obj) {
      return;
    }
    const data = this.props.list_data && Object.assign({}, this.props.list_data.filter(item => item.GPKDID === parseInt(e.nativeEvent.id, 0))[0]);
    if (this.state.obj && this.state.obj.GPKDID === data.GPKDID) {
      return;
    }
    this.setState({ obj: data });
  }


  onItemPress = (item: any) => () => {
    const camera = {
      center: {
        latitude: item.location.latitude,
        longitude: item.location.longitude,
      },
      zoom: 8
    };
    this.map.current.mapview.animateCamera(camera);
  }

  getCurrentPosition = () => {
    getLocation()
      .then(position => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        };
        this.setRegion(region);
      })
      .catch(e => {
        alert('Permission', e.message || e, Platform.select({
          android: () => {

          },
          ios: () => Linking.openURL('app-settings:')
        }));
      });
  };

  onChangeMapView = () => {
    this.setState({ mapType: (this.state.mapType + 1) % types.length });
  };

  clearObj = () => {
    this.setState({
      obj: null
    });
  }

  onReady = (result: any) => {
    this.map.current.fitToCoordinates(result.coordinates, {
      edgePadding: {
        right: (metrics.width / 20),
        bottom: (metrics.height / 20),
        left: (metrics.width / 20),
        top: (metrics.height / 20),
      }
    });
  }
  onError = (errorMessage: any) => {
    console.log(errorMessage);
  }

  direction = () => {
    this.setState({
      coordinates: [
        {
          latitude: 10.8855119,
          longitude: 106.5887824,
        },
        {
          latitude: this.state.obj.location.latitude,
          longitude: this.state.obj.location.longitude,
        },
      ],
      obj: null
    });
  }

  clearSearchText = () => {
    this.props.clearData
  }

  onItemScrollView = (item: any) => {
    if (this.state.obj && item.GPKDID === this.state.obj.GPKDID) {
      return;
    }
    this.setState({
      obj: item
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          tracksViewChanges={false}
          ref={this.map}
          provider={PROVIDER_GOOGLE}
          style={{ ...StyleSheet.absoluteFillObject }}
          data={this.props.list_data}
          loadingEnabled
          zoomEnabled
          mapType={types[this.state.mapType]}
          initialRegion={initialRegion}
          onMarkerPress={this.onMarkerPress}
        >
          {
            this.props.list_data.map(pin =>
              <CustomMarker
                id={pin.GPKDID}
                identifier={`${pin.GPKDID}`}
                key={pin.GPKDID}
                coordinate={pin.location}
              />
            )
          }
          {
            this.props.list_data.length === 0 && this.state.obj &&
            <CustomMarker
              id={this.state.obj.GPKDID}
              identifier={`${this.state.obj.GPKDID}`}
              key={this.state.obj.GPKDID}
              coordinate={this.state.obj.location}
            />
          }
          {(this.state.coordinates.length === 2) && (
            <MapViewDirections
              origin={this.state.coordinates[0]}
              destination={this.state.coordinates[1]}
              apikey={'AIzaSyCYvMpmVhFc0ydILEuXGJNYNGFnBoKPCL8'}
              strokeWidth={3}
              strokeColor="red"
              onReady={this.onReady}
              onError={this.onError}
            />
          )}
        </MapView>
        <BottomSheet
          value={this.props.keyword}
          getCurrentPosition={this.getCurrentPosition}
          clearData={this.props.clearData}
          showFilter={this.showFilter}
          category={this.props.category}
          list_data={this.props.list_data}
          onChangeMapView={this.onChangeMapView}
          categoryId={this.props.categoryId}
          onItemScrollView={this.onItemScrollView}
          clearDataCategory={this.props.clearDataCategory}
        />
        <MapPanel
          obj={this.state.obj}
          clearObj={this.clearObj}
          direction={this.direction}
        />
      </View>
    )
  }
}
export default Map;
