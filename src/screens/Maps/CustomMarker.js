//@flow
import React from 'react';
import { Marker } from 'react-native-maps';
import type { LatLng } from 'react-native-maps';

type MakerProps = {
  coordinate: LatLng,
  identifier: string,
  id: number,
}

type State = {
  tracksViewChanges:?boolean
}


export default class CustomMaker extends React.Component<MakerProps, State> {

  state = {
    tracksViewChanges: true,
  }
  

  componentDidUpdate() {
    if (this.state.tracksViewChanges) {
      this.setState(() => ({
        tracksViewChanges: false,
      }))
    }
  }
  shouldComponentUpdate(nextProps: any) {
    if (this.props.coordinate.latitude !== nextProps.coordinate.latitude
      && this.props.coordinate.longitude !== nextProps.coordinate.longitude) {
      return true;
    }
    return false;
  }
  render() {
    return (
      <Marker
        tracksViewChanges={this.state.tracksViewChanges}
        key={this.props.id}
        identifier={this.props.identifier}
        coordinate={{
          latitude: this.props.coordinate.latitude,
          longitude: this.props.coordinate.longitude
        }}
      />
    )
  }
}
