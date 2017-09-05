'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';

import { connect } from 'dva'
import { createAction, NavigationActions } from '../../utils'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
import MonitorData from './MonitorData';
import MonitorChart from './MonitorChart';
import dateFormat from 'dateformat'
import Calendar from 'react-native-calendar-select';
import {parseDate} from '../../utils'
import { Modal,SegmentedControl} from 'antd-mobile';

import LoadingComponent from '../Common/LoadingComponent'
import NoDataComponent from '../Common/NoDataComponent'
import Icon from 'react-native-vector-icons/Ionicons';
const operation = Modal.operation;
@connect(({ monitordata,point }) => ({ dataType:monitordata.dataType,startDate:monitordata.startDate,
  endDate:monitordata.endDate,pollutant:monitordata.pollutant,datafetching:monitordata.datafetching,
selectedpoint:point.selectedpoint,monitordata:monitordata.monitordata}))
class HistoryData extends PureComponent {
  constructor (props) {
      const now = new Date();
    super(props);

    this.state = {
      isupdate:false,
      startDate:dateFormat(now,"yyyy-mm-dd"),
      endDate:dateFormat(now.setDate(now.getDate() + 1),"yyyy-mm-dd"),
      pollutant:this.props.selectedpoint.PollutantTypeInfo[0]?this.props.selectedpoint.PollutantTypeInfo[0]:{PolluntCode:'001',PolluntName:'COD',Sort:'1',Unit:'mg/L'}
    };

  }
  _onChange=(e)=>{
    let i=e.nativeEvent.selectedSegmentIndex;
    this.props.dispatch(createAction('monitordata/searchdata')({
      dgimn:this.props.navdgimn,
      startDate:this.props.startDate,
      endDate:this.props.endDate,
      pollutant:this.props.pollutant,
      dataType:i==0?'realtime':i==1?'minute':i==2?'hour':i=3?'day':'other'
    }));
  }

  _onValueChange=(value)=>{}

    _confirmDate=({startDate, endDate, startMoment, endMoment})=>{
      this.setState({
        startDate:dateFormat(startDate,"yyyy-mm-dd"),
        endDate:dateFormat(endDate,"yyyy-mm-dd")
      });
      this.props.dispatch(createAction('monitordata/searchdata')({
        dgimn:this.props.navdgimn,
        startDate:dateFormat(startDate,"yyyy-mm-dd"),
        endDate:dateFormat(endDate,"yyyy-mm-dd"),
        pollutant:this.state.pollutant,
        dataType:this.props.dataType
      }));
    }


    _onClose = (sel) => {
      // this.setState({ sel });
      if(sel!='cancel')
      {
        this.setState({
          pollutant:sel
        });
        this.props.dispatch(createAction('monitordata/searchdata')({
          dgimn:this.props.navdgimn,
          startDate:this.state.startDate,
          endDate:this.state.endDate,
          pollutant:sel,
          dataType:this.props.dataType
        }));
      }
      // Popup.hide();

    }
  render() {
    let color = {
       subColor: '#fff',
       mainColor:'#4c68ea'
     };
     const xAxis=[];
    const monitorData=[];
    this.props.monitordata.map((type, i) => {
      xAxis.push(dateFormat(parseDate(type.MonitorTime),"dd日HH时MM分"));
      if(this.props.dataType=='realtime')
      {
        monitorData.push(type.MonitorValue);
      }else {
        monitorData.push(type.AvgValue);
      }
    });
    return (
      <View style={{flex:1,backgroundColor:'#f0f0f0'}}>
        <View style={{flex:1,marginTop:5,backgroundColor:'#ffffff',}}>
          <SegmentedControl
            style={{width:SCREEN_WIDTH-40,marginTop:10,marginLeft:20}}
          values={['实时', '分钟', '小时','日']}
          onChange={this._onChange}
          onValueChange={this._onValueChange}
        />
        <View style={{flexDirection:'column',flex:1,backgroundColor:'#fff'}}>
          <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',backgroundColor:'#fff'}}>
            <TouchableOpacity onPress={()=>{
              this.calendar && this.calendar.open();
            }}>
              <Image source={require('../../images/time.png')} style={{marginLeft:10,height:20,width:20}}/>
            </TouchableOpacity>
            <View style={{flexDirection:'column',alignItems: 'center',}}>
              <Text style={{fontSize:16,color:'#4c68ea'}}>{this.state.pollutant.PolluntName}</Text>
              <Text style={{fontSize:13,color:'#989797'}}>{this.state.startDate+'——'+this.state.endDate}</Text>
            </View>
            <TouchableOpacity onPress={()=>{
              let opItem=[];
              this.props.selectedpoint.PollutantTypeInfo.map((item, index) => {

                opItem.push({ text: item.PolluntName+'['+item.Unit+']', onPress: () => {
                  this._onClose(item)
                } });

              })
              operation(opItem)
            }}>
              <Image source={require('../../images/pollution_type_on.png')} style={{marginRight:10,height:20,width:20}}/>
            </TouchableOpacity>
            <Calendar
            i18n="zh"
            ref={(calendar) => {this.calendar = calendar;}}
            color={color}
            format="YYYYMMDD"
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            minDate={dateFormat(new Date(),"yyyy0101")}
            maxDate={dateFormat(new Date(),"yyyymmdd")}
            onConfirm={this._confirmDate}
          />
          </View>
          {
            this.props.datafetching?
            <LoadingComponent Message='正在加载数据'/>
            :this.props.monitordata.length!=0?
            <View style={{flex:1}}>
              <View style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT/2-140}}>
                <MonitorChart xAxis={xAxis} data={monitorData}  navdgimn={this.props.navdgimn}  />
              </View>
              <View style={{width:SCREEN_WIDTH,height:Platform.OS === 'ios'?SCREEN_HEIGHT/2-50:SCREEN_HEIGHT/2-80}}>
                <MonitorData   xAxis={xAxis} data={monitorData}  navdgimn={this.props.navdgimn}  />
              </View>
            </View>
          :
          <NoDataComponent Message='没有查询到数据'/>
        }

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


export default HistoryData;
