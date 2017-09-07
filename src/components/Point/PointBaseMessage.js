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

@connect(({ point }) => ({ selectedpoint:point.selectedpoint}))
class PointBaseMessage extends PureComponent {
  render() {
    const img=this.props.selectedpoint.Point.Status==0?
    require('../../images/offlinepoint.png'):this.props.selectedpoint.Point.Status==1?
    require('../../images/onlinepoint.png'):this.props.selectedpoint.Point.Status==2?
    require('../../images/overpoint.png'):
    require('../../images/exceptionpoint.png')
    return (
      <View style={{backgroundColor:'#ffffff'}}>
        <Image source={img} style={{position:'absolute',top:5,left:SCREEN_WIDTH-120,height:80,width:80}}/>
        <View style={{height:40,borderBottomColor:'#c9c9c9',borderBottomWidth:1,justifyContent: 'center',}}>
          <Text style={{fontSize:17,marginLeft:10,color:'#2d2d2d',width:100}}>{'基本信息'}</Text>
        </View>
        <View style={{flexDirection:'column',height:110,borderBottomColor:'#c9c9c9',borderBottomWidth:1,justifyContent: 'space-around',alignItems: 'flex-start',}}>
          <TouchableOpacity onPress={()=>{
            this.props.dispatch(createAction('target/selecttarget')({
              targetCode:this.props.selectedpoint.Point.TargetCode,
              baseType:this.props.selectedpoint.Point.BaseType
            }));
            
          }}>
            <Text style={{marginLeft:11,fontSize:17,color:'#bebebe'}}>{this.props.selectedpoint.Point.TargetName}</Text>
          </TouchableOpacity>
          <Text style={{marginLeft:12,fontSize:13,color:'#949494'}}>{this.props.selectedpoint.Point.PointName}</Text>
          <View style={{marginLeft:12,width:SCREEN_WIDTH,flexDirection:'row',justifyContent: 'space-between',}}>
            <View style={{flexDirection:'row'}}>
              <Image source={require('../../images/person.png')} style={{width:15,height:15}}/>
              <Text style={{marginLeft:5,color:'#949494'}}>{this.props.selectedpoint.Point.Linkman}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Image source={require('../../images/phone.png')} style={{width:15,height:15}}/>
              <View style={{marginLeft:5,}}><LinkingTouchable url={'tel:'+this.props.selectedpoint.Point.MobilePhone} title={this.props.selectedpoint.Point.MobilePhone}/></View>
            </View>
            <View style={{marginRight:15,flexDirection:'row'}}>
              <Text style={{marginLeft:5,color:'#949494'}}>{'详情'}</Text>
                <Image source={require('../../images/next_on.png')} style={{width:15,height:15}}/>
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


export default PointBaseMessage;
