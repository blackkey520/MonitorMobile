'use strict';

import React, { Component,PureComponent} from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'dva'
import { createAction, NavigationActions } from '../../utils'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
import LinkingTouchable from '../../components/Common/LinkingTouchable'
import Swiper from 'react-native-swiper';

@connect(({ target }) => ({ targetBase:target.targetBase}))
class TargetBaseMessage extends PureComponent {
  render() {

    return (
      <View style={{backgroundColor:'#ffffff'}}>
        {/* <View style={{height:40,borderBottomColor:'#c9c9c9',borderBottomWidth:1,justifyContent: 'center',}}>
          <Text style={{fontSize:17,marginLeft:10,color:'#2d2d2d',width:100}}>{'基本信息'}</Text>
        </View> */}
        <View style={{flexDirection:'column',height:140,borderTopColor:'#3363dc',borderTopWidth:1,
          justifyContent: 'flex-start',alignItems: 'flex-start',backgroundColor:'#5783f1'}}>
          <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',width:SCREEN_WIDTH}}>
            <Text style={{marginLeft:11,marginTop:15,fontSize:17,color:'#fff'}}>{this.props.targetBase.TargetInfo.TargetName}</Text>

          </View>

          <Text style={{marginLeft:12,marginTop:20,fontSize:13,color:'#fff'}}>{this.props.targetBase.TargetInfo.TargetRegionCode}</Text>
        </View>
        <View style={{marginTop:-50,width:SCREEN_WIDTH-60,marginLeft:30,flexDirection:'row',justifyContent: 'space-around'
          ,backgroundColor:'#e2ebfd',borderColor:'#9cadd4',borderWidth:1,borderRadius:10,height:60,alignItems: 'center'}}>
          <View style={{marginLeft:20,flexDirection:'row',width:SCREEN_WIDTH/2-30}}>
            <Image source={require('../../images/targetlinkman.png')} style={{width:30,height:30}}/>
            <View>
              <Text style={{marginLeft:5,fontSize:15,color:'#7e8087'}}>{this.props.targetBase.TargetInfo.TargetLinkman}</Text>
              <Text style={{marginLeft:5,fontSize:13,color:'#b6b9c5'}}>{'负责人'}</Text>
            </View>
          </View>
          <View style={{flexDirection:'row',width:SCREEN_WIDTH/2-30}}>
            <Image source={require('../../images/targetphone.png')} style={{marginTop:3,width:30,height:30}}/>
            <View >
              <View style={{marginLeft:5,}}><LinkingTouchable  url={'tel:'+this.props.targetBase.TargetInfo.TargetMobilePhone}
                title={this.props.targetBase.TargetInfo.TargetMobilePhone}/></View>
              <Text style={{marginTop:3,marginLeft:5,fontSize:13,color:'#b6b9c5'}}>{'联系电话'}</Text>
            </View>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
img:{
  width:SCREEN_WIDTH,
  height:SCREEN_HEIGHT/4
}
});


export default TargetBaseMessage;
