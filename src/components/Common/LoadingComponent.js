'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from 'react-native';

class LoadingComponent extends Component {
  render() {
    return (
      <View style={{flex:1,flexDirection:'row',alignItems: 'center',justifyContent: 'center',}}>
        <ActivityIndicator />
        <Text style={{color:'#716b6a'}}>{this.props.Message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});


export default LoadingComponent;
