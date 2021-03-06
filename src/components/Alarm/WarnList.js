

import React, { PureComponent } from 'react';

import {
  View,
  Text,
  SectionList,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { NavigationActions, createAction } from '../../utils';
import LoadingComponent from '../Common/LoadingComponent';
import NoDataComponent from '../Common/NoDataComponent';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

@connect(({ warn }) => ({ getmorewarn: warn.getmorewarn,
  loading: warn.loading,
  warnlist: warn.warnlist,
  fetchtime: warn.fetchtime }))
class WarnList extends PureComponent {
  extraUniqueKey=(item, index) => `index${index}${item}`
    footer=() => {
      if (this.props.loading) {
        return (<View style={{ height: 50, width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center', }}>
          <LoadingComponent Message={'正在加载数据'} /></View>);
      } else if (!this.props.getmorewarn && this.props.warnlist.length !== 0) {
        return (<TouchableOpacity
          onPress={() => {
            this.props.dispatch(createAction('warn/loadwarnlist')({
              isfirst: false,
              time: this.props.fetchtime
            }));
          }}
          style={{ height: 50, width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center', }}
        ><Text>{'点击加载更多'}</Text></TouchableOpacity>);
      }
      return (<View />);
    }
    renderSectionHeader=({ section }) => (
      <View style={{ flex: 1, flexDirection: 'row', height: 30, alignItems: 'center', backgroundColor: '#f3f3f3' }}>
        <Image source={require('../../images/alarm_time.png')} style={{ marginLeft: 15, height: 15, width: 15 }} />
        <Text style={{ marginLeft: 10, fontSize: 12, color: '#787878' }} >{section.key}</Text>
      </View>
    )
    renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => {
          this.props.dispatch(NavigationActions.navigate({
            routeName: 'AlarmDetail',
            params: { pointname: item.PointName,
              alarmbegindate: moment(item.DateNow).format('YYYY-MM-DD 00:00:00'),
              alarmdgimn: item.DGIMN,
              alarmenddate: moment(item.DateNow).format('YYYY-MM-DD 23:59:59')
            },
          }));
        }}
        style={{ flex: 1, width: SCREEN_WIDTH - 20, borderRadius: 10, marginLeft: 10, backgroundColor: '#fff', marginTop: 5 }}
      >
        <View style={{ flex: 1, flexDirection: 'row', height: 30, alignItems: 'center' }}>
          <Image source={require('../../images/alarm_company.png')} style={{ marginLeft: 10, height: 15, width: 15 }} />
          <Text style={{ marginLeft: 7, fontSize: 14, color: '#5e5d61' }} >{item.ParentName}</Text>
        </View>
        <View style={{ marginLeft: 25 }}><Text style={{ marginLeft: 7, fontSize: 13, color: '#838285' }}>{item.PointName}</Text></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
          <View style={{ flex: 1, marginLeft: 20, flexDirection: 'row', height: 30, alignItems: 'center' }}>
            <Image source={require('../../images/alarm_long.png')} style={{ marginLeft: 10, height: 15, width: 15 }} />
            <Text style={{ marginLeft: 7, fontSize: 12, color: '#bdbdbd' }} >{'报警时长'}</Text>
            <Text style={{ marginLeft: 7, fontSize: 12, color: '#4498ff' }} >{item.Count}</Text>
            <Text style={{ marginLeft: 7, fontSize: 12, color: '#bdbdbd' }} >{'min'}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', height: 30, alignItems: 'center' }}>
            <Image source={require('../../images/alarm_nums.png')} style={{ marginLeft: 10, height: 15, width: 15 }} />
            <Text style={{ marginLeft: 7, fontSize: 12, color: '#bdbdbd' }} >{'报警次数'}</Text>
            <Text style={{ marginLeft: 7, fontSize: 12, color: '#e0190a' }} >{item.Count}</Text>
            <Text style={{ marginLeft: 7, fontSize: 12, color: '#bdbdbd' }} >{'次'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
    render() {
      return (
        <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
          <SectionList
            keyExtractor={this.extraUniqueKey}
            ListFooterComponent={this.footer}
            renderSectionHeader={this.renderSectionHeader}
            ListEmptyComponent={() => (this.props.loading ? null : <View style={{ height: SCREEN_HEIGHT - 200 }}><NoDataComponent Message={'没有查询到数据'} /></View>)}
            refreshing={false}
            initialNumToRender={10}
            onRefresh={() => {
              this.props.dispatch(createAction('warn/loadwarnlist')({
                isfirst: true,
                time: moment().format('YYYY-MM-DD')
              }));
            }}
            onEndReached={(info) => {
              if (this.props.fetchtime != null && this.props.getmorewarn) {
                this.props.dispatch(createAction('warn/loadwarnlist')({
                  isfirst: false,
                  time: this.props.fetchtime
                }));
              }
            }}
            onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
            renderItem={this.renderItem}
            sections={this.props.warnlist}
          />
        </View>
      );
    }
}


export default WarnList;
