'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'dva'
import { createAction,NavigationActions } from '../../utils'

@connect()
export default class Loading extends PureComponent {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: '正在加载中',
    headerTintColor:'#fff',
    headerStyle:{backgroundColor:'#4f6aea'}
  });
  constructor(props) {
    super(props);

  }
  render() {
      return (
          <View style={{flex:1,alignItems: 'center',justifyContent: 'center',}}>
            <TouchableOpacity onPress={()=>{

            }}>
              <Text>
                {'正在加载中'}
              </Text>
            </TouchableOpacity>
          </View>
      )
  }

}
