

import React, { PureComponent } from 'react';

import {
  View,
  Dimensions,
  Text,
  FlatList,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { createAction } from '../../utils';
import LoadingComponent from '../../components/Common/LoadingComponent';
import NoDataComponent from '../../components/Common/NoDataComponent';

const SCREEN_WIDTH = Dimensions.get('window').width;

@connect(({ point, monitordata }) => ({ selectedpoint: point.selectedpoint,
  datafetching: monitordata.datafetching,
  current: monitordata.current,
  total: monitordata.total,
  pollutant: monitordata.pollutant,
  dataType: monitordata.dataType,
  startDate: monitordata.startDate,
  endDate: monitordata.endDate,
  monitordata: monitordata.monitordata,
  pageSize: monitordata.pageSize }))
class MonitorData extends PureComponent {
   header=() => (
     <View style={{ flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'space-around',
       backgroundColor: '#fff',
       height: 30 }}
     >
       <Text style={{ fontSize: 13, color: '#787777', width: 60, textAlign: 'center' }}>污染物</Text>
       <Text style={{ fontSize: 13, color: '#787777', width: 60, textAlign: 'center' }}>监测值</Text>
       <Text style={{ fontSize: 13, color: '#787777', width: 70, textAlign: 'center' }}>标准值</Text>
       <Text style={{ fontSize: 13, color: '#787777', width: 80, textAlign: 'center' }}>监测时间</Text>
     </View>
   )


    extraUniqueKey=(item, index) => `index${index}${item}`
    footer=() => {
      if (this.props.current > this.props.total / this.props.pageSize) {
        return (<View style={{ height: 50, width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center', }}>
          <Text>{'没有更多数据了'}</Text></View>);
      }
      if (this.props.datafetching) {
        return (<View style={{ height: 50, width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center', }}>
          <LoadingComponent Message={'正在加载数据'} /></View>);
      }
      return (<View />);
    }
    renderItem=({ item }) => (
      <View style={{ flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: '#dbd8d8' }}
      >
        <Text style={{ fontSize: 13, color: '#4a4848', width: 60, textAlign: 'center' }}>{this.props.pollutant.PolluntName}</Text>
        <Text style={{ fontSize: 13, color: item.IsOver === -1 ? '#4a4848' : item.color !== '' ? item.color : '#4a4848', width: 60, textAlign: 'center' }}>{item.formatValue}</Text>
        <Text style={{ fontSize: 13, color: '#4a4848', width: 70, textAlign: 'center' }}>{item.StandardValue === '' ? '-' : item.StandardValue}</Text>
        <Text style={{ fontSize: 13, color: '#4a4848', width: 80, textAlign: 'center' }}>{item.formatTime}</Text>
      </View>
    )
    render() {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            ListFooterComponent={this.footer}
            ListEmptyComponent={() => (this.props.datafetching ? null : <NoDataComponent Message={'没有查询到数据'} />)}
            keyExtractor={this.extraUniqueKey}
            data={this.props.monitordata}
            ListHeaderComponent={this.header}
            renderItem={this.renderItem}
            onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
            initialNumToRender={10}
            refreshing={false}
            onRefresh={() => {
              this.props.dispatch(createAction('monitordata/searchdata')({
                dgimn: this.props.selectedpoint.Point.Dgimn,
                startDate: this.props.startDate,
                endDate: this.props.endDate,
                pollutant: this.props.pollutant,
                dataType: this.props.dataType
              }));
            }}
            onEndReached={(info) => {
              if (this.props.current <= this.props.total /
                 this.props.pageSize && !this.props.datafetching) {
                // NOTE: 调用查询方法
                //  monitorStore.fetchMore();
                this.props.dispatch(createAction('monitordata/searchmore')({
                  current: this.props.current + 1
                }));
              }
            }}
          />

        </View>
      );
    }
}


export default MonitorData;
