import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  InteractionManager
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Emitter from '../../lib';
import Header from '../../elements/Header';
import { colors, metrics } from '../../utils';


class SearchView extends React.Component {
  constructor(props) {
    super(props);
    this.listIcon = ['ios-cafe', 'ios-home', 'ios-card', 'logo-xbox', 'ios-settings', 'ios-medical', 'ios-restaurant', 'ios-boat'];
    this.state = {
      renderLayout: false,
      data: [
        'Cafe', 'Street food', 'ATM', 'Hotel', 'Sport', 'Service', 'Education',
        'Shopping', 'Travel', 'Beauty & Spa'
      ],
      text: '',
      toggle: false,
      category: Object.entries(this.props.category).map(item => item[1])
    }
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={Math.random()}
        style={{ width: metrics.width / 4, alignItems: 'center' }}
        onPress={this.onCategoryPress(item)}
      >
        <View style={styles.wrapperIcon}>
          <Ionicon
            name={this.listIcon[(item.DanhMucId - 1) % this.listIcon.length]}
            size={24}
            color="green"
          />
        </View>
        <Text>{item.TenDanhMuc}</Text>
      </TouchableOpacity>
    )
  }

  _goBack = () => {
    this.props.navigation.goBack();
  }

  onItemPress = (item) => () => {
    this.props.navigation.goBack();
    Emitter.emit('showPanel', item);
  }

  onChangeText = (text) => {
    if (!text) {
      this.props.clearData();
    }
    this.props.fetchData({ keyword: text, lat: 10.751091, lng: 106.714973 });
    this.setState({ text });
  }

  onBlur = () => {
    this.setState({ toggle: !this.state.toggle });
  }

  onFocus = () => {
    this.setState({ toggle: !this.state.toggle });
  }

  onCategoryPress = (item) => () => {
    this.props.getDataWithCategory({ danhmucID: item.DanhMucId, lat: 10.751091, lng: 106.714973 });
    this.props.navigation.goBack();
    Emitter.emit('showPanelList', item);
  }


  renderList = () => {
    if (this.state.text) {
      return (
        <FlatList
          key="sss"
          data={this.props.data}

          keyExtractor={(item) => `${item.GPKDID}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.GPKDID}
              style={styles.itemList}
              onPress={this.onItemPress(item)}
            >
              <Text style={{ paddingVertical: 10 }} numberOfLines={1} >{item.DiaChi}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: 'gray' }} />}
          ListFooterComponent={
            <ActivityIndicator
              animating={this.props.loading}
              size="small"
              color="#0000ff"
            />
          }
        />
      )
    }
    return (
      <FlatList
        key="aaa"
        keyExtractor={({ item, index }) => `${Math.random()}`}
        data={this.state.category}
        renderItem={this._renderItem}
        numColumns={4}
        columnWrapperStyle={{
          flexWrap: 'wrap',
          marginVertical: 10,
        }}
      />
    )
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}
      >
        <Header
          onLeftPress={this._goBack}
          onChangeText={this.onChangeText}
          value={this.props.keyword}
          loading={this.props.loading}
          clearSearchText={this.props.clearData}
        />
        <View
          style={{ flex: 1, backgroundColor: 'transparent' }}
        >
          {this.renderList()}
        </View>

      </View>

    )
  }
}

const styles = StyleSheet.create({
  wrapperIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.HEADER,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default SearchView;
