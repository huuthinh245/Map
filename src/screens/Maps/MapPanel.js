import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import {
  PanGestureHandler,
  NativeViewGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { metrics, colors } from '../../utils';

const USE_NATIVE_DRIVER = true;
const SNAP_POINTS_FROM_TOP = [Platform.OS === 'ios' ? 50 : 24, metrics.height - metrics.width, metrics.height];

export default class MapPanel extends Component {
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
    if (prevProps.obj !== this.props.obj && this.props.obj) {
      return 'show';
    } else if (!this.props.obj && prevProps.obj){
      return 'hide';
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot === 'show') {
       this.showBottomSheet();
    } else if (snapshot ===  'hide') {
      this.hideBottomSheet();
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
      this.setState({ lastSnap: destSnapPoint});
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
    this.props.clearObj();
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
                inputRange: SNAP_POINTS_FROM_TOP,
                outputRange: [1, 1, 0]
              }),
              zIndex: 10,
              transform: [{
                translateY: this._translateY.interpolate({
                  inputRange: SNAP_POINTS_FROM_TOP,
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
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
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
              {/* <Animated.View style={styles.headerHide}> */}
              <Animated.Image
                        source={require('../../assets/logo/abc.jpg')}
                        style={{
                          width: metrics.width,
                          height: metrics.width / 2,
                        }}
                      />
              {/* </Animated.View> */}
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
                  <SafeAreaView style={{ flex: 1 }}>
                    <Animated.View
                      style={styles.panel}
                    >
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                        }}
                      >

                        <TouchableOpacity
                          style={{ marginLeft: 5 }}
                          onPress={this.onPanel}
                        >
                          <Text
                            style={styles.headerPanelTitle}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            Quán ăn  cafe giải khát sinh tố  nước mía
                                </Text>
                          <Text
                            style={styles.headerContent}
                            numberOfLines={1}
                          >
                            {this.props.obj ? this.props.obj.DiaChi : ''}
                            </Text>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 0.9 }}>
                              <Ionicon
                                size={20}
                                name="ios-restaurant"
                                color="green"
                              />
                              <Text style={styles.headerContent}>
                                {' '}Ẩm thực đường phố
                        </Text>
                            </Text>
                            <Text style={{ flex: 0.1, alignSelf: 'flex-end', textAlign: 'right' }}>
                              5 <Ionicon
                                size={14}
                                name="ios-star"
                                color="green"
                              />
                            </Text>
                          </View>
                        </TouchableOpacity>

                      </View>
                      <View style={styles.wrapperOptionPanel1}>
                        <View style={styles.wraperPanelIcon}>
                          <Ionicon size={36} name="ios-call" color="silver" />
                          <Text>call</Text>
                        </View>
                        <View style={styles.wraperPanelIcon}>
                          <Ionicon size={36} name="ios-bookmarks" color="silver" />
                          <Text>bookmark</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.wraperPanelIcon}
                          onPress={this.props.direction}
                        >
                          <Ionicon size={36} name="ios-share" color="silver" />
                          <Text>share</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.wrapperCallOption}>
                        <Text>
                          <Ionicon size={26} name="ios-call" color="silver" />
                          {'\t\t'}<Text>(84-75) 3 833 679</Text>
                        </Text>
                      </View>
                    </Animated.View>
                  </SafeAreaView>
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
  // wrapperIcon: {
  //   zIndex: 1,
  //   backgroundColor: 'green',
  //   alignSelf: 'flex-end',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginRight: 10,
  //   width: 30,
  //   height: 30,
  //   borderRadius: 15,
  //   marginTop: 10,
  //   shadowColor: '#000',
  //   shadowRadius: 15,
  //   shadowOpacity: 0.5,
  //   shadowOffset: { width: 0, height: 2 },
  //   elevation: 4,
  // },
  panel: {
    backgroundColor: '#fff',
    flex: 1
  },
  headerPanelTitle: {
    fontSize: metrics.scale(16),
    color: 'black',
    marginRight: 50
  },
  headerContent: {
    color: 'silver',
  },
  wraperPanelIcon: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapperOptionPanel1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'silver',
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  wrapperCallOption: {
    borderBottomWidth: 1,
    borderColor: 'silver',
    paddingVertical: 10,
    marginHorizontal: 10,
    justifyContent: 'center'
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
