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
import { Card } from 'antd-mobile';

@connect(({ target }) => ({ targetBase:target.targetBase}))
class TargetMonitorPoint extends PureComponent {
  _renderMonitorData=(monitorData)=>{
    let rtnDataVal=[];
    monitorData.map((item,key)=>{
      if(key<6)
      {
        if(item.NewestRealTimeData&&item.NewestRealTimeData!=null)
        {
          let color='#575656'
          if(item.Level!=null)
          {
            if(item.Level.StandardColor!=''){
              color=item.Level.StandardColor
            }
          }
          rtnDataVal.push(
            <View key={key} style={{marginTop:5,flex:1,flexDirection:'row',alignItems: 'center',width:SCREEN_WIDTH-45,marginLeft:10,justifyContent: 'space-around',}}>
              <Text style={{width:SCREEN_WIDTH/4-10,fontSize:13,color:'#575656'}}>{item.NewestRealTimeData.PollutantName}</Text>
              <Text style={{width:SCREEN_WIDTH/4-10,fontSize:13,color:color}}>{item.NewestRealTimeData.Value}</Text>
              <Text style={{width:SCREEN_WIDTH/4-10,fontSize:13,color:'#575656'}}>{item.Level!=null?item.Level.StandardValue:'-'}</Text>
              <Text style={{width:SCREEN_WIDTH/4-10,fontSize:13,color:'#575656'}}>{item.NewestRealTimeData.Multiple!=null&&item.NewestRealTimeData.Multiple!=''
                ?item.NewestRealTimeData.Multiple:'-'}</Text>
            </View>
          );
        }else{
          rtnDataVal.push(
            <View key={key} style={{marginTop:5,flex:1,flexDirection:'row',alignItems: 'center',width:SCREEN_WIDTH-45,marginLeft:10,justifyContent: 'space-around',}}>
              <Text style={{width:SCREEN_WIDTH/4-10,fontSize:13,color:'#575656'}}>{item.PolluntName}</Text>
              <Text style={{width:SCREEN_WIDTH/4-10,fontSize:13,color:'#575656'}}>{'-'}</Text>
              <Text style={{width:SCREEN_WIDTH/4-10,fontSize:13,color:'#575656'}}>{'-'}</Text>
              <Text style={{width:SCREEN_WIDTH/4-10,fontSize:13,color:'#575656'}}>{'-'}</Text>
            </View>
          );
        }
      }
    })
    if(rtnDataVal.length==0)
    {
      rtnDataVal=(
        <View style={{flex:1,alignItems: 'center',justifyContent: 'center',}}>
          <Text style={{color:'#585757',fontSize:15}}>
            {'无监控数据'}
          </Text>
        </View>
      );
    }
    return rtnDataVal;
  }
  _renderMonitorPoints=()=>{
    let rtnVal=[];
    this.props.targetBase.OtherInfo.map((item,key)=>{
      let source=null;
      if(item.Status==0)
      {
        source=require('../../images/offline-head-list.png');
      }else if(item.Status==1)
      {
        source=require('../../images/online-head-list.png');
      }else if(item.Status==2)
      {
        source=require('../../images/over-head-list.png');
      }else if(item.Status==3)
      {
        source=require('../../images/exception-head-list.png');
      }else{
        source=require('../../images/offline-head-list.png');
      }
      rtnVal.push(
        <View key={key} style={{width:SCREEN_WIDTH-30,marginLeft:15,marginTop:15,borderColor:'#e2e1e1',borderWidth:1,borderRadius:10,}}>
          <TouchableOpacity onPress={()=>{
            this.props.dispatch(createAction('point/selectpoint')({
              dgimn:item.Dgimn
            }));
            this.props.dispatch(NavigationActions.navigate({
              routeName: 'MonitorPoint',params:{dgimn:item.Dgimn}
            }));
          }} style={{flex:1,flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',
          borderTopColor:'#5c89f3',borderTopWidth:5,borderRadius:10}}>
            <View style={{marginLeft:15,flexDirection:'row',marginTop:3}}>
              <Image source={source} style={{height:15,width:45}}/>
              <Text style={{color:'#585757',fontSize:15,marginLeft:5}}>{item.PointName}</Text>
            </View>
            <View style={{marginRight:12,marginTop:3}} >
              <Text style={{color:'#808080',fontSize:13}}>{item.MonitorPointPollutant[0]&&item.MonitorPointPollutant[0].NewestRealTimeData!=null?item.MonitorPointPollutant[0].NewestRealTimeData.Time:'-'}</Text>
            </View>
          </TouchableOpacity>
          <View style={{marginTop:5,marginBottom:10}}>
            <View style={{marginTop:5,flex:1,flexDirection:'row',alignItems: 'center',width:SCREEN_WIDTH-45,marginLeft:10,
              justifyContent: 'space-around'}}>
              <Text style={{width:SCREEN_WIDTH/4-10,fontSize:12,color:'#b1b1b1'}}>{'污染物'}</Text>
              <Text style={{width:SCREEN_WIDTH/4-10,fontSize:12,color:'#b1b1b1'}}>{'监控数值'}</Text>
              <Text style={{width:SCREEN_WIDTH/4-10,fontSize:12,color:'#b1b1b1'}}>{'标准值'}</Text>
              <Text style={{width:SCREEN_WIDTH/4-10,fontSize:12,color:'#b1b1b1'}}>{'倍数'}</Text>
            </View>
            {
              this._renderMonitorData(item.MonitorPointPollutant)
            }
          </View>
        </View>

      );
      if(rtnVal.length==0)
      {
        rtnVal=(
          <View style={{flex:1,alignItems: 'center',justifyContent: 'center',}}>
            <Text>
              {'无监测点'}
            </Text>
          </View>
        );
      }
    })
    return rtnVal;
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'#ffffff'}}>
        {this._renderMonitorPoints()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
});


export default TargetMonitorPoint;
