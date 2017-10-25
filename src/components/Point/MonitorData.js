'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'dva'
import { createAction, NavigationActions } from '../../utils'
import LoadingComponent from '../../components/Common/LoadingComponent'
import NoDataComponent from '../../components/Common/NoDataComponent'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;

@connect(({ point,monitordata }) => ({ selectedpoint:point.selectedpoint,
  datafetching:monitordata.datafetching,current:monitordata.current,total:monitordata.total,
  pollutant:monitordata.pollutant,dataType:monitordata.dataType
  ,startDate:monitordata.startDate,endDate:monitordata.endDate,monitordata:monitordata.monitordata}))
class MonitorData extends PureComponent {
   _header=()=>{
     return (
       <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-around',
          backgroundColor:'#fff',height:30}}>
         <Text style={{fontSize:13,color:'#787777',width:60}}>污染物</Text>
         <Text style={{fontSize:13,color:'#787777',width:60}}>监测值</Text>
         <Text style={{fontSize:13,color:'#787777',width:70}}>标准值</Text>
         <Text style={{fontSize:13,color:'#787777',width:80}}>监测时间</Text>
       </View>
     );
   }
     _renderItem=({item})=>{
       let monitorVal=this.props.dataType=='realtime'?item.MonitorValue:item.AvgValue
       return(
             <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-around',
                backgroundColor:'#fff',height:45,borderBottomWidth:1,borderBottomColor:'#dbd8d8'}}>
               <Text style={{fontSize:13,color:'#4a4848',width:60}}>{this.props.pollutant.PolluntName}</Text>
               <Text style={{fontSize:13,color:item.IsOver==-1?'#4a4848':item.color!=''?item.color:'#4a4848',width:60}}>{monitorVal==null?'-':monitorVal}</Text>
               <Text style={{fontSize:13,color:'#4a4848',width:70}}>{item.StandardValue==''?'-':item.StandardValue}</Text>
               <Text style={{fontSize:13,color:'#4a4848',width:80}}>{item.MonitorTime}</Text>
             </View>
       );
   }

    _extraUniqueKey=(item ,index)=>{
    return "index"+index+item;
    }
    _footer=()=>{

      if(this.props.datafetching)
      {
        if(this.props.current>this.props.total)
        {
          return (<View style={{height:50,width:SCREEN_WIDTH,alignItems: 'center',justifyContent: 'center',}}>
            <Text>{'没有更多数据了'}</Text></View>);
        }
        else{
          return (<View style={{height:50,width:SCREEN_WIDTH,alignItems: 'center',justifyContent: 'center',}}>
            <LoadingComponent   Message={'正在加载数据'}/></View>);
        }
      }else{
        return (<View></View>);
      }
    }
   render() {
     return (
       <View style={{flex:1}}>
         <FlatList
             ListFooterComponent={this._footer}
             ListEmptyComponent={()=>this.props.datafetching?null:<NoDataComponent Message={'没有查询到数据'}/>}
             keyExtractor = {this._extraUniqueKey}
            data={this.props.monitordata}
            ListHeaderComponent={this._header}
            renderItem={this._renderItem}
            onEndReachedThreshold={Platform.OS === 'ios'?0:1}
            initialNumToRender={10}
            refreshing={false}
            onRefresh={()=>{
              this.props.dispatch(createAction('monitordata/searchdata')({
                dgimn:this.props.selectedpoint.Point.Dgimn,
                startDate:this.props.startDate,
                endDate:this.props.endDate,
                pollutant:this.props.pollutant,
                dataType:this.props.dataType
              }));
            }}
            onEndReached={(info)=>{
              if(this.props.current<=this.props.total&&!this.props.datafetching)
              {
                // NOTE: 调用查询方法
               //  monitorStore.fetchMore();
               this.props.dispatch(createAction('monitordata/searchmore')({
                 current:this.props.current+1
               }));
              }
            }}
        />

       </View>
     );
   }
}


const styles = StyleSheet.create({
  LayoutStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
  },

});


export default MonitorData;
