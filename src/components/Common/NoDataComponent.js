

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text
} from 'react-native';

class NoDataComponent extends Component {
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
        <Image source={require('../../images/nonedata.png')} style={{ height: 100, width: 100 }} />
        <Text style={{ marginTop: 15, color: '#716b6a' }}>{this.props.Message}</Text>
      </View>
    );
  }
}


export default NoDataComponent;
