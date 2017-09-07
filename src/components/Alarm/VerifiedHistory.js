'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  SectionList,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import { connect } from 'dva'
import { NavigationActions,createAction} from '../../utils'
import LoadingComponent from '../Common/LoadingComponent'
import NoDataComponent from '../Common/NoDataComponent'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
import WarningReason from '../../config/configjson/WarningReason.json';
import moment from 'moment'

@connect(({ alarm }) => ({ verifiedfetching:alarm.verifiedfetching,verifiedlist:alarm.verifiedlist,verifiedtime:alarm.verifiedtime}))
class VerifiedHistory extends PureComponent {
  _renderItem = ({item}) =>{
    let reasonname='';
    reasonname= WarningReason.find((value, index, arr)=>{
      return value.ID==item.Reson;
    })
    return (
      <TouchableOpacity onPress={()=>{
        this.props.dispatch(createAction('alarm/getfeedbackdetail')({
          verifyID:item.ID
        }));
      }} style={{flex:1,width:SCREEN_WIDTH-20,borderRadius:10,marginLeft:10,backgroundColor:'#fff',marginTop:5}}>
        <View style={{flex:1, flexDirection:'row', height: 30,alignItems: 'center'}}>
          <Image source={require('../../images/alarm_company.png')} style={{marginLeft:10,height:15,width:15}}/>
          <Text style={{marginLeft:7,fontSize: 14,color: '#5e5d61'}} >{item.EntName}</Text>
        </View>
        <View style={{marginLeft:25}}><Text style={{marginLeft:7,fontSize: 13,color: '#838285'}}>{item.PointName}</Text></View>
        <View style={{marginLeft:25,marginTop:5,flexDirection:'row',justifyContent: 'space-between',}}>
            <Text style={{marginLeft:7,fontSize: 12,color: '#5e5d61'}} >{reasonname?reasonname.ReasonType:''}</Text>
        </View>
        <View style={{marginLeft:30,flexDirection:'row',justifyContent: 'space-between',}}>
          <View style={{flex:1,  flexDirection:'row', height: 30,alignItems: 'center'}}>
            <Text style={{fontSize: 12,color: '#dfdfdf'}} >{item.VerifyTime.substring(11,item.VerifyTime.length)}</Text>
          </View>
          <View style={{flex:1,  flexDirection:'row', height: 30,alignItems: 'center'}}>
            <Text style={{fontSize: 12,color: '#4498ff'}} >{'共'}</Text>
            <Text style={{fontSize: 12,color: '#4498ff'}} >{item.Count}</Text>
            <Text style={{fontSize: 12,color: '#4498ff'}} >{'条'}</Text>
          </View>
          <View style={{flex:1,  flexDirection:'row', height: 30,alignItems: 'center'}}>
            <Text style={{fontSize: 12,color: '#dfdfdf'}} >{'核实人:'}</Text>
            <Text style={{fontSize: 12,color: '#dfdfdf'}} >{item.VerifiedPerson}</Text>
          </View>
        </View>

        <View style={{marginLeft:30,marginBottom:10,backgroundColor:'#ebecef',height:80,width:SCREEN_WIDTH-70,flexDirection:'row',justifyContent: 'space-between',}}>
          <Text style={{marginTop:5,marginLeft:5,marginBottom:5,marginRight:5,fontSize: 12,color: '#959494'}} >{item.VerifyMsg}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  _renderSectionHeader=({section})=>{
    return (
      <View style={{flex:1, flexDirection:'row', height: 30,alignItems: 'center',backgroundColor:'#f3f3f3'}}>
          <Image source={require('../../images/alarm_time.png')} style={{marginLeft:15,height:15,width:15}}/>
          <Text style={{marginLeft:10,fontSize: 12,color: '#787878'}} >{section.key}</Text>
       </View>
    );
  }
  _extraUniqueKey=(item ,index)=>{
    return "index"+index+item;
  }
  _footer=()=>{
    if(this.props.verifiedfetching)
    {
      return (<View style={{height:50,width:SCREEN_WIDTH,alignItems: 'center',justifyContent: 'center',}}>
        <LoadingComponent   Message={'正在加载数据'}/></View>);
    }else if(this.props.verifiedlist.length==0){
      return (<View style={{height:50,width:SCREEN_WIDTH,alignItems: 'center',justifyContent: 'center',}}>
        <Text>{'没有查询到数据'}</Text></View>);
    }else{
      return (<View></View>);
    }
  }
render() {
  return (
    <View style={styles.layout}>
        <SectionList
          keyExtractor = {this._extraUniqueKey}
          renderSectionHeader={this._renderSectionHeader}
          ListEmptyComponent={()=>this.props.verifiedfetching?null:<NoDataComponent Message={'没有查询到数据'}/>}
          ListFooterComponent={this._footer}
          refreshing={false}
          onRefresh={()=>{
            this.props.dispatch(createAction('alarm/loadverifiedlist')({
              isfirst:true,
                time:moment().format('YYYY-MM-DD')
            }));
          }}
          onEndReached={(info)=>{
            if(this.props.verifiedtime!=null)
            {
              this.props.dispatch(createAction('alarm/loadverifiedlist')({
                isfirst:false,
                  time:this.props.verifiedtime
              }));
            }else{

            }
          }}
          onEndReachedThreshold={Platform.OS === 'ios'?0:1}
           renderItem={this._renderItem}
        sections={this.props.verifiedlist}
        />
    </View>
  );
}
}

const styles = StyleSheet.create({
  layout:{
    flex:1,
    backgroundColor:'#f0f0f0'
  },
});


export default VerifiedHistory;
