'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import { connect } from 'dva'
import { NavigationActions,createAction} from '../../utils'
import LoadingComponent from '../../components/Common/LoadingComponent'
import NoDataComponent from '../../components/Common/NoDataComponent'
import WarningReason from '../../config/configjson/WarningReason.json';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
@connect(({ alarm }) => ({ feedbackdetailfetching:alarm.feedbackdetailfetching,
  feedbackalarmdetail:alarm.feedbackalarmdetail}))
class FeedbackAlarmDetail extends PureComponent {
  _extraUniqueKey=(item ,index)=>{
  return "index"+index+item;
  }
  _renderItem=({item})=>{
    let reasonname='';
    reasonname= WarningReason.find((value, index, arr)=>{
      return value.ID==item.Reson;
    })
      return (
        <TouchableOpacity style={{width:SCREEN_WIDTH-20,borderRadius:10,
          marginLeft:10,backgroundColor:'#fff',marginTop:5}} onPress={() => {
        }}>
            <View style={{marginTop:10,flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',}}>
              <View style={{marginLeft:10,flexDirection:'row',alignItems: 'center',justifyContent: 'center',}}>
                <Text style={{marginLeft:5,fontSize:15,color:'#37353a'}}>{item.ExceptionType}</Text>
              </View>
              <View style={{marginRight:10,flexDirection:'row',alignItems: 'center',justifyContent: 'center',}}>
                <Image source={require('../../images/alarm_long.png')} style={{width:15,height:15}}/>
                <Text style={{marginLeft:5,fontSize:13,color:'#a4a4a4'}}>{item.AlarmTime}</Text>
              </View>
            </View>
            <View style={{marginTop:10,marginBottom:10,flex:1,marginLeft:30,width:SCREEN_WIDTH-70}}>
              <Text style={{fontSize:12,color:'#a0a0a2'}}>{item.AlarmMsg}</Text>
            </View>
        </TouchableOpacity>
          )

}
  render() {
    return (
      <View style={{flex:1,backgroundColor:'#f0f0f0'}}>
        <FlatList
                ListEmptyComponent={()=>this.props.alarmlistfetching?null:<NoDataComponent Message={'没有查询到数据'}/>}
                keyExtractor = {this._extraUniqueKey}
               data={this.props.feedbackalarmdetail}
               renderItem={this._renderItem}
           />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});


export default FeedbackAlarmDetail;
