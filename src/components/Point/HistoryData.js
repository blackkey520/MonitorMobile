

import React, { Component, PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';

import { connect } from 'dva';
import { createAction, NavigationActions } from '../../utils';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
import MonitorData from './MonitorData';
import MonitorChart from './MonitorChart';
import moment from 'moment';
import Calendar from 'react-native-calendar-select';
import { parseDate } from '../../utils';
import { Modal, SegmentedControl } from 'antd-mobile';

import LoadingComponent from '../Common/LoadingComponent';
import NoDataComponent from '../Common/NoDataComponent';
import Icon from 'react-native-vector-icons/Ionicons';
const operation = Modal.operation;
@connect(({ monitordata, point }) => ({ dataType: monitordata.dataType,
  startDate: monitordata.startDate,
  endDate: monitordata.endDate,
  pollutant: monitordata.pollutant,
  datafetching: monitordata.datafetching,
  selectedpoint: point.selectedpoint,
  monitordata: monitordata.monitordata }))
class HistoryData extends PureComponent {
  constructor(props) {
    const now = new Date();
    super(props);

    this.state = {
      isupdate: false,
      startDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      pollutant: this.props.selectedpoint.PollutantTypeInfo[0] ? this.props.selectedpoint.PollutantTypeInfo[0] : { PolluntCode: '001', PolluntName: 'COD', Sort: '1', Unit: 'mg/L' }
    };
  }
  _onChange=(e) => {
    const i = e.nativeEvent.selectedSegmentIndex;
    let dataType;
    let startDate;
    let endDate;
    if (i == 0) {
      dataType = 'realtime';
      startDate = moment().add(-10, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().format('YYYY-MM-DD HH:mm:ss');
    } else if (i == 1) {
      dataType = 'minute';
      startDate = moment().add(-2, 'hours').format('YYYY-MM-DD HH:mm');
      endDate = moment().format('YYYY-MM-DD HH:mm');
    } else if (i == 2) {
      dataType = 'hour';
      startDate = moment().add(-1, 'days').format('YYYY-MM-DD HH:00');
      endDate = moment().format('YYYY-MM-DD HH:00');
    } else {
      dataType = 'day';
      startDate = moment().add(-1, 'months').format('YYYY-MM-DD');
      endDate = moment().format('YYYY-MM-DD');
    }
    this.setState({
      startDate,
      endDate
    });
    this.props.dispatch(createAction('monitordata/searchdata')({
      dgimn: this.props.navdgimn,
      startDate,
      endDate,
      pollutant: this.props.pollutant,
      dataType
    }));
  }

  _onValueChange=(value) => {}

  _confirmDate=({ startDate, endDate, startMoment, endMoment }) => {
    this.setState({
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD')
    });
    this.props.dispatch(createAction('monitordata/searchdata')({
      dgimn: this.props.navdgimn,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      pollutant: this.state.pollutant,
      dataType: this.props.dataType
    }));
  }


  _onClose = (sel) => {
      // this.setState({ sel });
    if (sel != 'cancel') {
      this.setState({
        pollutant: sel
      });
      this.props.dispatch(createAction('monitordata/searchdata')({
        dgimn: this.props.navdgimn,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        pollutant: sel,
        dataType: this.props.dataType
      }));
    }
      // Popup.hide();
  }
  render() {
    const color = {
      subColor: '#fff',
      mainColor: '#4c68ea'
    };

    return (
      <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
        <View style={{ flex: 1, marginTop: 5, backgroundColor: '#ffffff', }}>
          <SegmentedControl
            style={{ width: SCREEN_WIDTH - 40, marginTop: 10, marginLeft: 20 }}
            values={['实时', '分钟', '小时', '日']}
            onChange={this._onChange}
            onValueChange={this._onValueChange}
          />
          <View style={{ flexDirection: 'column', flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff' }}>
              <TouchableOpacity onPress={() => {
                this.calendar && this.calendar.open();
              }}
              >
                <Image source={require('../../images/time.png')} style={{ marginLeft: 10, height: 20, width: 20 }} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'column', alignItems: 'center', }}>
                <Text style={{ fontSize: 16, color: '#4c68ea' }}>{this.state.pollutant.PolluntName}</Text>
                <Text style={{ fontSize: 13, color: '#989797' }}>{`${this.state.startDate}——${this.state.endDate}`}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                const opItem = [];
                this.props.selectedpoint.PollutantTypeInfo.map((item, index) => {
                  opItem.push({ text: `${item.PolluntName}[${item.Unit}]`,
                    onPress: () => {
                      this._onClose(item);
                    } });
                });
                operation(opItem);
              }}
              >
                <Image source={require('../../images/pollution_type_on.png')} style={{ marginRight: 10, height: 20, width: 20 }} />
              </TouchableOpacity>
              <Calendar
                i18n="zh"
                ref={(calendar) => { this.calendar = calendar; }}
                color={color}
                format="YYYYMMDD"
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                minDate={moment().format('YYYY0101')}
                maxDate={moment().format('YYYYMMDD')}
                onConfirm={this._confirmDate}
              />
            </View>
            {
            this.props.datafetching ?
              <LoadingComponent Message="正在加载数据" />
            : this.props.monitordata.length != 0 ?
              <View style={{ flex: 1 }}>
                <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT / 2 - 140 }}>
                  <MonitorChart navdgimn={this.props.navdgimn} />
                </View>
                <View style={{ width: SCREEN_WIDTH, height: Platform.OS === 'ios' ? SCREEN_HEIGHT / 2 - 50 : SCREEN_HEIGHT / 2 - 80 }}>
                  <MonitorData navdgimn={this.props.navdgimn} />
                </View>
              </View>
          :
              <NoDataComponent Message="没有查询到数据" />
        }

          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  img: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 4
  }
});


export default HistoryData;
