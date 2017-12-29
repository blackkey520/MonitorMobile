// import liraries
import React, { Component } from 'react';
import { View, Dimensions, Text, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from '../../utils';

const SCREEN_WIDTH = Dimensions.get('window').width;

@connect(({ monitordata, point }) => ({ lastmonitorpoint: monitordata.lastmonitorpoint,
  lastmonitordata: monitordata.lastmonitordata,
  spinning: monitordata.spinning,
  selectedpoint: point.selectedpoint }))
class MonitorView extends Component {
    renderData=() => {
      let rtnVal;
      if (this.props.lastmonitorpoint != null &&
        this.props.lastmonitorpoint.DGIMN === this.props.selectedpoint.Point.Dgimn) {
        if (this.props.spinning) {
          rtnVal = (<View style={{ flexDirection: 'row', height: 100, width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
            <Text style={{ fontSize: 17, color: '#bebebe' }}>{'无监测数据'}</Text>
          </View>);
        } else if (this.props.lastmonitordata.length === 0) {
          rtnVal = (<View style={{ height: 100, width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, color: '#bebebe' }}>{'无监测数据'}</Text>
          </View>);
        } else {
          rtnVal = [];
          this.props.lastmonitordata.map((item, key) => {
            let color = '#575757';
            if (item.StandardColor !== '') {
              color = item.StandardColor;
            }
            rtnVal.push(
              <View
                key={item.PollutantCode}
                style={{ flexDirection: 'row',
                  width: SCREEN_WIDTH,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'space-around' }}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center', width: SCREEN_WIDTH / 4 + 30, height: 30, borderRightColor: '#dddddd', borderRightWidth: 1 }}><Text style={{ color }}>{`${item.PollutantName}(${item.Unit === null ? '-' : item.Unit})`}</Text></View>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: SCREEN_WIDTH / 4 - 10, height: 30, borderRightColor: '#dddddd', borderRightWidth: 1 }}><Text style={{ color }}>{item.Value}</Text></View>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: SCREEN_WIDTH / 4, height: 30, borderRightColor: '#dddddd', borderRightWidth: 1 }}><Text style={{ color }}>{item.IsOver}</Text></View>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: SCREEN_WIDTH / 4 - 20, height: 30 }}><Text style={{ color: '#575757' }}>{item.Multiple == null ? '-' : item.Multiple}</Text></View>
              </View>
            );
          });
        }
      } else {
        rtnVal = (<View style={{ flexDirection: 'row', height: 100, width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
          <Text style={{ fontSize: 17, color: '#bebebe' }}>{'无监测数据'}</Text>
        </View>);
      }
      return rtnVal;
    }
    renderDate=() => (
      <Text style={{ marginLeft: 5, color: '#949494' }}>{`${this.props.lastmonitordata[0] ? this.props.lastmonitordata[0].Time : ''}`}</Text>
    );
    render() {
      return (
        <View style={{ backgroundColor: '#ffffff' }}>
          <View style={{ height: 40, borderBottomColor: '#c9c9c9', borderBottomWidth: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, marginLeft: 10, color: '#2d2d2d', width: SCREEN_WIDTH }}>{'最近的监控数据'}</Text>
          </View>
          <View style={{ flexDirection: 'column', borderBottomColor: '#c9c9c9', borderBottomWidth: 1, justifyContent: 'space-around', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row',
                borderBottomColor: '#dddddd',
                borderBottomWidth: 1,
                width: SCREEN_WIDTH,
                height: 30,
                alignItems: 'center',
                justifyContent: 'space-around' }}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center', width: SCREEN_WIDTH / 4 + 30, height: 30, borderRightColor: '#dddddd', borderRightWidth: 1 }}><Text style={{ color: '#575757' }}>污染物</Text></View>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: SCREEN_WIDTH / 4 - 10, height: 30, borderRightColor: '#dddddd', borderRightWidth: 1 }}><Text style={{ color: '#575757' }}>监测值</Text></View>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: SCREEN_WIDTH / 4, height: 30, borderRightColor: '#dddddd', borderRightWidth: 1 }}><Text style={{ color: '#575757' }}>标准</Text></View>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: SCREEN_WIDTH / 4 - 20, height: 30 }}><Text style={{ color: '#575757' }}>倍数</Text></View>
              </View>
              {this.renderData()}
            </View>
            <View style={{ borderTopColor: '#dddddd',
              borderTopWidth: 1,
              width: SCREEN_WIDTH,
              flexDirection: 'row',
              justifyContent: 'space-between' }}
            >
              <View style={{ marginLeft: 12, marginTop: 5, flexDirection: 'row' }}>
                <Image source={require('../../images/alarm_time.png')} style={{ marginTop: Platform.OS === 'ios' ? 1 : 3, width: 15, height: 15 }} />
                {this.renderDate()}
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.dispatch(NavigationActions.navigate({
                    routeName: 'HistoryData',
                    params: {
                      dgimn: this.props.selectedpoint.Point.Dgimn,
                      pollutant: this.props.selectedpoint.PollutantTypeInfo[0],
                    } }));
                }}
                style={{ marginTop: 5, height: 25, marginRight: 15, flexDirection: 'row' }}
              >
                <Text style={{ marginLeft: 5, color: '#949494' }}>{'更多'}</Text>
                <Image source={require('../../images/next_on.png')} style={{ marginTop: Platform.OS === 'ios' ? 1 : 3, width: 15, height: 15 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
}

export default MonitorView;
