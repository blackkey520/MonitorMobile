

import React, { Component } from 'react';

import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

class LoadingComponent extends Component {
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={'#4f6aea'} />
        <Text style={{ color: '#716b6a' }}>{this.props.Message}</Text>
      </View>
    );
  }
}


export default LoadingComponent;
