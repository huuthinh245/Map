import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Text,
    Animated
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';



class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }
    }
    onLeftPress = () => {
        if (this.props.index) {
          this.props.context.openDrawer();
        } else {
          this.props.hideBottomSheet();
          this.props
        }
    }

    onCenterPress = () => {
      this.props.context.openSearch();
    }

    _renderItem = ({ item }) => {
      <View key={item.GPKDID} style={{ backgroundColor: 'red' }}>
        <Text>{item.DiaChi}</Text>
      </View>
    }
    render() {
        return (
            <SafeAreaView style={[{ backgroundColor: 'transparent'}, this.props.style]}>
                <Animated.View
                    style={[styles.container, this.props.animated]}
                >
                    <TouchableOpacity
                        style={[styles.leftElement, { backgroundColor: this.props.index && this.state.text === '' ? 'green' : '#fff' }]}
                        onPress={this.onLeftPress}
                    >
                        {
                            this.props.index && this.state.text === '' ?
                                <Ionicon
                                    name="ios-menu"
                                    color="#fff"
                                    size={26}
                                />
                                :
                                <Ionicon
                                    name="ios-arrow-round-back"
                                    color="gray"
                                    size={26}
                                />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.centerElement} activeOpacity={1} onPress={this.onCenterPress}>
                        <Text style={{ marginLeft: 5 }}>{this.props.value}</Text>
                    </TouchableOpacity>
                    <View
                        style={styles.rightElement}
                    >
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
                                    onPress={this.props.clearData}
                                    color="gray"
                                    size={26}
                                />

                        }
                    </View>
                </Animated.View>
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
    }
})

export default SearchBar;
