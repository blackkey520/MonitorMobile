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
import { loadStorage } from '../../logics/rpc';
@connect()
export default class Error extends PureComponent {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: '程序出错了',
    headerTintColor:'#fff',
    headerStyle:{backgroundColor:'#4f6aea'}
  });
  constructor(props) {
    super(props);

  }
  render() {
      return (
          <View style={{flex:1,flexDirection:'column',alignItems: 'center',justifyContent: 'center',}}>
            <TouchableOpacity onPress={()=>{
              let pollutantType=loadStorage('pollutantType');
              let alarmCount=loadStorage('alarmCount');
              this.props.dispatch(NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Main',params:{unverifiedCount:alarmCount,pollutanttype:pollutanttype} })],
              }))
            }}>
              <Text style={{marginTop:15,color:'#716b6a'}}>
                {this.props.navigation.state.params.errormessage}
              </Text>
              <Text style={{marginTop:13,color:'#716b6a'}}>
                {'点击刷新应用'}
              </Text>
            </TouchableOpacity>
          </View>
      )
  }

}
