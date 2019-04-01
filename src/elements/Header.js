import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }
  onLeftPress = () => {
    this.props.onLeftPress();
  }


  render() {
    return (
      <SafeAreaView style={{ backgroundColor: 'rgba(117, 206, 134, 0.5)' }}>
        {Platform.OS === 'android' && Platform.Version >= 20 ?
          <View
            style={{
              height: 24,
              backgroundColor: 'rgba(117, 206, 134, 0.5)',
            }}
          />
          : null
        }
        <View
          style={styles.container}
        >
          <TouchableOpacity
            style={[styles.leftElement]}
            onPress={this.onLeftPress}
          >
            <Ionicon
              name="ios-arrow-round-back"
              color="gray"
              size={26}
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
          <View style={styles.centerElement}>
            <TextInput
              onChangeText={this.props.onChangeText}
              value={this.props.value}
            />
          </View>
          <View
            style={styles.rightElement}
          >
            <ActivityIndicator
              animating={this.props.loading}
              size="small"
              color="#0000ff"
            />
            {
              this.props.value === '' ?
                <Ionicon
                  name="ios-search"
                  color="gray"
                  size={26}
                />
                :
                <Ionicon
                  name="ios-close"
                  onPress={() => {
                    // this.setState({ text: ''})
                    // this.refs['input'].blur();
                    this.props.clearSearchText();
                  }}
                  color="gray"
                  size={26}
                />

            }
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    marginHorizontal: 10,
    borderRadius: 5,
    marginVertical: 10,
    height: 40,
    zIndex: 5
  },
  leftElement: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 2.5,
    borderBottomLeftRadius: 2.5,
  },
  centerElement: {
    flex: 0.8,
    justifyContent: 'center',
  },
  rightElement: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 5
  }
})

export default Header;
