'use strict';

import React, { Component,PureComponent} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Platform
} from 'react-native';
import { connect } from 'dva'
import { NavigationActions,createAction,ShowToast} from '../../utils'
import LoadingComponent from '../../components/Common/LoadingComponent'
import NoDataComponent from '../../components/Common/NoDataComponent'
import Calendar from 'react-native-calendar-select';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
import { Button } from 'antd-mobile';
import moment from 'moment'
@connect(({ alarm }) => ({ alarmtotal:alarm.alarmtotal,alarmcurrent:alarm.alarmcurrent,alarmlistfetching:alarm.alarmlistfetching,alarmlist:alarm.alarmlist}))
class AlarmDetail extends PureComponent {
  static navigationOptions = ({ navigation, screenProps }) => ({
      headerTitle: navigation.state.params.pointname,
      headerBackTitle:null,
      headerTintColor:'#fff',
      headerStyle:{backgroundColor:'#4f6aea'},
  });
  constructor(props) {
    super(props);
    this.state = {
       begintime:this.props.navigation.state.params.alarmbegindate,
       endtime:this.props.navigation.state.params.alarmenddate,
       selected: (new Map(): Map<string, boolean>)
    };
  }
  _renderItem=({item})=>{

    return (
            <TouchableOpacity style={{width:SCREEN_WIDTH-20,borderRadius:10,
              marginLeft:10,backgroundColor:'#fff',marginTop:5}} onPress={() => {
                this.setState((state) => {
                  // copy the map rather than modifying state.
                  const selected = new Map(state.selected);
                  if(selected.get(item.ID)==undefined){
                    selected.set(item.ID, true); // toggle
                  }
                  else{
                    selected.delete(item.ID);
                    // selected.set(item.ID, !selected.get(item.ID)); // toggle
                  }
                  return {selected};
                });
            }}>
                <View style={{marginTop:10,flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',}}>
                  <View style={{marginLeft:10,flexDirection:'row',alignItems: 'center',justifyContent: 'center',}}>
                    {this.state.selected.get(item.ID)?
                      <Image source={require('../../images/checkbox_pressed.png')} style={{width:17,height:17}} />:
                      <Image source={require('../../images/checkbox_normal.png')} style={{width:17,height:17}} />
                    }
                    <Text style={{marginLeft:5,fontSize:15,color:'#37353a'}}>{item.AlarmType==2?'超标报警':'异常报警'}</Text>
                  </View>
                  <View style={{marginRight:10,flexDirection:'row',alignItems: 'center',justifyContent: 'center',}}>
                    <Image source={require('../../images/alarm_long.png')} style={{width:15,height:15}}/>
                    <Text style={{marginLeft:5,fontSize:13,color:'#a4a4a4'}}>{item.FirstTime.substring(10,item.FirstTime.length)+
                      '-'+item.AlarmTime.substring(10,item.AlarmTime.length)}</Text>
                  </View>
                </View>
                <View style={{marginTop:10,marginBottom:10,flex:1,marginLeft:30,width:SCREEN_WIDTH-70}}>
                  <Text style={{fontSize:12,color:'#a0a0a2'}}>{item.AlarmMsg}</Text>
                </View>
            </TouchableOpacity>
        )
  }
  _extraUniqueKey=(item ,index)=>{
  return "index"+index+item;
  }
  _footer=()=>{
    if(this.props.alarmlistfetching)
    {
      return (<View style={{height:50,width:SCREEN_WIDTH,alignItems: 'center',justifyContent: 'center',}}>
        <LoadingComponent   Message={'正在加载数据'}/></View>);
    }else{
      return (<View></View>);
    }
  }
  _confirmDate=({startDate, endDate, startMoment, endMoment})=>{
    this.setState({
      begintime:moment(startDate).format('YYYY-MM-DD'),
      endtime:moment(endDate).format('YYYY-MM-DD')
    });
    this.props.dispatch(createAction('alarm/loadalarmlist')({
      alarmdgimn:this.props.navigation.state.params.alarmdgimn,
      alarmbegindate:moment(startDate).format('YYYY-MM-DD 00:00:00'),
      alarmenddate:moment(endDate).format('YYYY-MM-DD 23:59:59'),
    }));
  }
  _clearselect=()=>{
    this.state.selected.clear();
  }
  render() {
    let color = {
       subColor: '#fff',
       mainColor:'#4c68ea'
     };
    return (
      <View style={styles.layout}>
        <View style={{alignItems: 'center',width:SCREEN_WIDTH,height:30,
          backgroundColor:'#f3f3f3',justifyContent: 'center',}}>
          <TouchableOpacity onPress={()=>{
            this.calendar && this.calendar.open();
          }} style={{}}>
            <Text style={{marginLeft:10,fontSize: 12,color: '#787878'}}>{this.state.begintime+'到'+this.state.endtime}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex:1}}>
          <FlatList
              ListFooterComponent={this._footer}
              ListEmptyComponent={()=>this.props.alarmlistfetching?null:<NoDataComponent Message={'没有查询到数据'}/>}
              keyExtractor = {this._extraUniqueKey}
             data={this.props.alarmlist}
             renderItem={this._renderItem}
             onEndReachedThreshold={Platform.OS === 'ios'?0:1}
             initialNumToRender={10}
             extraData={this.state.selected}
             refreshing={false}
             onRefresh={()=>{
               this.props.dispatch(createAction('alarm/loadalarmlist')({
                 alarmdgimn:this.props.navigation.state.params.alarmdgimn,
                 alarmbegindate:this.state.begintime,
                 alarmenddate:this.state.endtime
               }));
             }}
             onEndReached={(info)=>{
               if(this.props.alarmtotal!=0&&!this.props.alarmlistfetching&&this.props.alarmtotal>this.props.alarmcurrent)
               {
                 this.props.dispatch(createAction('alarm/loadmorealarmlist')({
                   current:this.props.alarmcurrent+1
                 }));
               }
             }}
         />
         <View style={{width:SCREEN_WIDTH,flexDirection:'row'}}>
           <Button className="btn" style={{width:SCREEN_WIDTH/2}} onClick={()=>{
             this.setState((state) => {
               // copy the map rather than modifying state.
               const selected = new Map(state.selected);
               this.props.alarmlist.map((item,key)=>{
                 if(selected.get(item.ID)==undefined){
                   selected.set(item.ID, true); // toggle
                 }
                 else{
                   selected.set(item.ID, !selected.get(item.ID)); // toggle
                 }
               });
               return {selected};
             });
           }} >全选</Button>
            <Button className="btn" style={{width:SCREEN_WIDTH/2,backgroundColor:'#4498ff'}} onClick={()=>{

              if(this.state.selected.size!=0)
              {
                this.props.dispatch(NavigationActions.navigate({
                  routeName: 'AlarmFeedback',params:{
                    alarmdgimn:this.props.navigation.state.params.alarmdgimn,
                    selected:this.state.selected,
                    clearselect:this._clearselect
                },}));
              }
              else{
                ShowToast('请选择报警记录进行核实');
              }
            }} type="primary">核实</Button>
         </View>
        </View>
        <Calendar
        i18n="zh"
        ref={(calendar) => {this.calendar = calendar;}}
        color={color}
        format="YYYYMMDD"
        startDate={this.state.begintime}
        endDate={this.state.endtime}
        minDate={moment().format('YYYY0101')}
        maxDate={moment().format('YYYYMMDD')}
        onConfirm={this._confirmDate}
      />
      </View>
    );
  }
}
const styles = StyleSheet.create({
    layout:{
      flex:1,
      backgroundColor:'#f0f0f0'
    }
});
export default AlarmDetail;
