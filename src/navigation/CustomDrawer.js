import React from 'react';
import {
  StatusBar,
  SafeAreaView,
  Text,
  View,
  Platform,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { width, height, colors } from '../utils/metrics';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Emitter from '../lib';

class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: true
    }
  }

  onToggle = () => {
    this.setState({ toggle: !this.state.toggle });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.toggle !== nextState.toggle && nextProps.navigation.state.isDrawerOpen) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.navigation.state.isDrawerOpen && !this.state.toggle) {
      this.setState({ toggle: true })
    }
  }

  onItemCLick = (index) => () => {
    switch (index) {
      case 1:
        Emitter.emit('itemClick', 'abcd');
        this.props.navigation.closeDrawer();
        break;

      default:
        break;
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>

        <StatusBar
          translucent
          backgroundColor="rgba(0, 0, 0, 0.20)"
          animated
        />
        {Platform.OS === 'android' && Platform.Version >= 20 ?
          <View
            style={{
              height: 24,
              backgroundColor: 'rgba(117, 206, 134, 0.5)',
            }}
          />
          : null
        }
        <SafeAreaView style={{ backgroundColor: colors.mainColor }}>
          <View style={styles.header}>
            <View
              style={styles.avatar}
            />
          </View>
        </SafeAreaView>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={1}
          onPress={this.onToggle}
        >
          <Text style={styles.buttonText}>Sign In</Text>
          <IonIcon
            style={{
              position: 'absolute',
              alignSelf: 'flex-end',
            }}
            size={18}
            name={this.state.toggle ? 'ios-arrow-down' : 'ios-arrow-up'}

          />
        </TouchableOpacity>
        <View style={styles.wrapperItem}>
          {
            this.state.toggle ?
              <View>
                <TouchableOpacity
                  onPress={this.onItemCLick(1)}
                  style={styles.item}>
                  <IonIcon
                    name="ios-locate"
                    size={24}
                    style={styles.icon}
                  />
                  <Text style={styles.itemText}>item 1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                  <IonIcon
                    name="ios-disc"
                    size={24}
                    style={styles.icon}
                  />
                  <Text style={styles.itemText}>item 2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                  <IonIcon
                    name="ios-navigate"
                    size={24}
                    style={styles.icon}
                  />
                  <Text style={styles.itemText}>item 3</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                  <IonIcon
                    name="ios-images"
                    size={24}
                    style={styles.icon}
                  />
                  <Text style={styles.itemText}>item 4</Text>
                </TouchableOpacity>
              </View>
              :
              <View>
                <TouchableOpacity style={styles.item}>
                  <IonIcon
                    name="logo-facebook"
                    size={24}
                    color="#3866b8"
                    style={styles.icon}
                  />
                  <Text style={styles.itemText}>facebook</Text>
                </TouchableOpacity>
              </View>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    height: height / 8,
    backgroundColor: colors.mainColor,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatar: {
    top: width / 12,
    width: width / 6,
    height: width / 6,
    backgroundColor: 'silver',
    borderRadius: width / 8,

  },
  button: {
    marginTop: width / 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'silver',
    justifyContent: 'flex-end'
  },
  buttonText: {
    fontSize: 18,
    color: '#000'
  },
  wrapperItem: {
    marginTop: 20
  },
  item: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  itemText: {
    marginLeft: 30,
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    height: 24
  }
})

export default Drawer;
