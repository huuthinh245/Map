import React, { Component } from 'react';
import { 
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image
} from 'react-native';
import {
  PanGestureHandler,
  NativeViewGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Ionicon from 'react-native-vector-icons/Ionicons';
import SearchBar from './SearchBar';
import { metrics, colors } from '../../utils';
import MapProvider, { MapContext } from './MapProvider';

const USE_NATIVE_DRIVER = true;
const SNAP_POINTS_FROM_TOP = [Platform.OS === 'ios' ? 50 : 24, metrics.height * 0.7, metrics.height];

export default class BottomSheet extends Component {
  masterdrawer = React.createRef();
  drawer = React.createRef();
  drawerheader = React.createRef();
  scroll = React.createRef();
  scrollView = React.createRef();
  y = 0;
  vY = 0;
  lastScroll = 0;


  constructor(props) {
    super(props);
    const START = SNAP_POINTS_FROM_TOP[0];
    const END = SNAP_POINTS_FROM_TOP[SNAP_POINTS_FROM_TOP.length - 1];

    this.state = {
      lastSnap: END,
    };
    this._lastScrollYValue = 0;
    this._lastScrollY = new Animated.Value(0);
    this._onRegisterLastScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this._lastScrollY } } }],
      { useNativeDriver: USE_NATIVE_DRIVER }
    );
    this._lastScrollY.addListener(({ value }) => {
      this._lastScrollYValue = value;
    });

    this._dragY = new Animated.Value(0);
    this._onGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: this._dragY } }],
      { useNativeDriver: USE_NATIVE_DRIVER }
    );

    this._reverseLastScrollY = Animated.multiply(
      new Animated.Value(-1),
      this._lastScrollY
    );

    this._translateYOffset = new Animated.Value(END);
    this._translateY = Animated.add(
      this._translateYOffset,
      Animated.add(this._dragY, this._reverseLastScrollY)
    ).interpolate({
      inputRange: [START, END],
      outputRange: [START, END],
      extrapolate: 'clamp',
    });
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.categoryId !== this.props.categoryId && this.props.categoryId) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      this.showBottomSheet();
    }
  }
  _onHeaderHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.BEGAN) {
      this._lastScrollY.setValue(0);
    }
    this._onHandlerStateChange({ nativeEvent });
  };
  _onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {

      let { velocityY, translationY } = nativeEvent;
      this.y = translationY;
      translationY -= this._lastScrollYValue;
      const dragToss = 0.05;
      const endOffsetY =
        this.state.lastSnap + translationY + dragToss * velocityY;

      let destSnapPoint = SNAP_POINTS_FROM_TOP[0];
      for (let i = 0; i < SNAP_POINTS_FROM_TOP.length; i++) {
        const snapPoint = SNAP_POINTS_FROM_TOP[i];
        const distFromSnap = Math.abs(snapPoint - endOffsetY);
        if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
          destSnapPoint = snapPoint;
        }
      }
      this.setState({ lastSnap: destSnapPoint });
      this._translateYOffset.extractOffset();
      this._translateYOffset.setValue(translationY);
      this._translateYOffset.flattenOffset();
      this._dragY.setValue(0);
      Animated.spring(this._translateYOffset, {
        velocity: 64,
        tension: 68,
        friction: 12,
        toValue: destSnapPoint,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    }
  };

  showBottomSheet = () => {
    this.setState({ lastSnap: SNAP_POINTS_FROM_TOP[1] });
    this._translateYOffset.extractOffset();
    this._translateYOffset.setValue(SNAP_POINTS_FROM_TOP[1]);
    this._translateYOffset.flattenOffset();
    this._dragY.setValue(0);
    Animated.spring(this._translateYOffset, {
      velocity: 64,
      tension: 68,
      friction: 12,
      toValue: SNAP_POINTS_FROM_TOP[1],
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }

  hideBottomSheet = () => {
    this._lastScrollY.setValue(0);
    this.scrollView.current.getNode().scrollTo({ y: 0 });
    this.y -= this._lastScrollYValue;
    this.setState({ lastSnap: SNAP_POINTS_FROM_TOP[2] });
    this._translateYOffset.extractOffset();
    this._translateYOffset.setValue(this.y);
    this._translateYOffset.flattenOffset();
    this._dragY.setValue(0);
    Animated.spring(this._translateYOffset, {
      velocity: 64,
      tension: 68,
      friction: 12,
      toValue: SNAP_POINTS_FROM_TOP[2],
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
    this.props.clearDataCategory();
  }

  onItemPress = (item) => () => {
    this.hideBottomSheet();
    this.props.onItemScrollView(item);
  }

  renderItem = () => {
    return this.props.list_data.map(item => (
      <TouchableOpacity 
        key={item.GPKDID} 
        style={styles.itemList}
        onPress={this.onItemPress(item)}
      >
        <Image
          source={{ uri: `http://10.86.222.82:9001//${this.props.category[this.props.categoryId].IconImage}` }}
          resizeMode='contain'
          style={{
            width: metrics.width / 4,
            height: metrics.width / 8,
          }}
        />
        <View style={{ flex: 1, marginLeft: 5 }}>
          <Text numberOfLines={1} style={{ flex: 1 }} >
            {item.DiaChi}
          </Text>
          <Text numberOfLines={1} style={{ flex: 1 }} >
            {item.SoGiayPhep}
          </Text>
        </View>
      </TouchableOpacity>
    ))
  }
  render() {
    return (
      <TapGestureHandler
        maxDurationMs={100000}
        ref={this.masterdrawer}
        maxDeltaY={this.state.lastSnap - SNAP_POINTS_FROM_TOP[0]}>

        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          {Platform.OS === 'android' && Platform.Version >= 20 ?
            <View
              style={{
                height: 24,
              }}
            />
            : null
          }
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              backgroundColor: colors.HEADER,
              opacity: this._translateY.interpolate({
                inputRange: [50, metrics.height * 0.4, metrics.height],
                outputRange: [1, 0, 0]
              }),
              zIndex: 10,
              transform: [{
                translateY: this._translateY.interpolate({
                  inputRange: [50, metrics.height * 0.3, metrics.height],
                  outputRange: [0, 0, -300]
                })
              }]
            }}
          >
            <SafeAreaView>
              {Platform.OS === 'android' && Platform.Version >= 20 ?
                <View
                  style={{
                    height: 24,
                  }}
                />
                : null
              }
              <TouchableOpacity
                style={styles.header}
                onPress={this.toggleBottomSheet}
              >
                <Ionicon
                  size={24}
                  color="#fff"
                  name="md-arrow-back"
                  style={{ marginLeft: 5 }}
                  onPress={this.hideBottomSheet}
                />
                <Text style={styles.headerTitle}>
                  {this.props.categoryId ? this.props.category[this.props.categoryId].TenDanhMuc : ''}
                </Text>
                <View
                  style={{ width: 24 }}
                />
              </TouchableOpacity>
            </SafeAreaView>
          </Animated.View>
          <MapProvider>
            <MapContext.Consumer>
              {context => <SearchBar
                hideBottomSheet={this.hideBottomSheet}
                context={context}
                index={this.state.lastSnap === SNAP_POINTS_FROM_TOP[2]}
                value={this.props.value}
                clearData={this.props.clearData}
                animated={{
                  transform: [{
                    translateY: this._translateY.interpolate({
                      inputRange: [50, metrics.height * 0.3, metrics.height],
                      outputRange: [-300, 0, 0]
                    })
                  }]
                }}
              />}
            </MapContext.Consumer>
          </MapProvider>
          <Animated.View
            style={{
              position: 'absolute',
              zIndex: 10,
              right: 0,
              left: 0,
              top: 100,
              opacity: this._translateY.interpolate({
                inputRange: [Platform.OS === 'ios' ? 50 : 24, metrics.height - 1, metrics.height],
                outputRange: [0, 0, 1],
              }),
              transform: [{ 
                translateY: this._translateY.interpolate({
                  inputRange: SNAP_POINTS_FROM_TOP,
                  outputRange: [-400, -400, 0],
                }),
              }]
            }}
          >
            <TouchableOpacity
              style={[styles.wrapperIcon]}
              onPress={this.props.getCurrentPosition}
            >
              <Ionicon
                name="md-locate"
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.wrapperIcon, { backgroundColor: 'white' }]}
              onPress={this.props.showFilter}
            >
              <Ionicon
                name="md-apps"
                size={24}
              />
            </TouchableOpacity>
          </Animated.View>
          <SafeAreaView
            style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 10 }}
          >
            <Animated.View
              style={[styles.wrapperIcon, { backgroundColor: '#fff' }, {
                opacity: this._translateY.interpolate({
                  inputRange: SNAP_POINTS_FROM_TOP,
                  outputRange: [0, 0, 1],
                })
              }]}
            >
              <Ionicon
                name="md-school"
                size={24}
                color="#000"
                onPress={this.props.onChangeMapView}
              />
            </Animated.View>
          </SafeAreaView>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: '#fff' },
              {
                transform: [{ translateY: this._translateY }],
              },
            ]}>
            <PanGestureHandler
              ref={this.drawerheader}
              simultaneousHandlers={[this.scroll, this.masterdrawer]}
              shouldCancelWhenOutside={false}
              onGestureEvent={this._onGestureEvent}
              onHandlerStateChange={this._onHeaderHandlerStateChange}>
              <Animated.View style={styles.header}>
                <Text>
                  {`Kết quả ${this.props.list_data.length}`}
                </Text>
              </Animated.View>
            </PanGestureHandler>
            <PanGestureHandler
              ref={this.drawer}
              simultaneousHandlers={[this.scroll, this.masterdrawer]}
              shouldCancelWhenOutside={false}
              onGestureEvent={this._onGestureEvent}
              onHandlerStateChange={this._onHandlerStateChange}>
              <Animated.View style={styles.container}>
                <NativeViewGestureHandler
                  ref={this.scroll}
                  waitFor={this.masterdrawer}
                  simultaneousHandlers={this.drawer}>
                  <Animated.ScrollView
                    style={[
                      styles.scrollView,
                      { marginBottom: SNAP_POINTS_FROM_TOP[0] },
                    ]}
                    ref={this.scrollView}
                    bounces={false}
                    onScrollBeginDrag={this._onRegisterLastScroll}
                    scrollEventThrottle={1}>
                    <SafeAreaView>
                      {this.renderItem()}
                    </SafeAreaView>
                  </Animated.ScrollView>
                </NativeViewGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </View>
      </TapGestureHandler>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: metrics.scale(18)
  },
  wrapperIcon: {
    zIndex: 1,
    backgroundColor: 'green',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowRadius: 15,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  itemList: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 0.5,
    borderColor: 'silver',
    paddingHorizontal: 5,
    paddingVertical: 5
  }
});
