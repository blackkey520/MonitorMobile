

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
import WarningReason from '../../config/configjson/WarningReason.json';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


@connect(({ verified }) => ({ getmoreverified: verified.getmoreverified,
  loading: verified.loading,
  verifiedlist: verified.verifiedlist,
  fetchtime: verified.fetchtime }))
class VerifiedList extends PureComponent {
  extraUniqueKey=(item, index) => `index${index}${item}`
  footer=() => {
    if (this.props.loading) {
      return (<View style={{ height: 50, width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center', }}>
        <LoadingComponent Message={'正在加载数据'} /></View>);
    } else if (!this.props.getmoreverified && this.props.verifiedlist.length !== 0) {
      return (<TouchableOpacity
        onPress={() => {
          this.props.dispatch(createAction('verified/loadverifiedlist')({
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
  renderItem = ({ item }) => {
    let reasonname = '';
    reasonname = WarningReason.find((value, index, arr) => value.ID === item.Reson);
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.dispatch(NavigationActions.navigate({
            routeName: 'FeedbackDetail',
            params: { verifyID: item.ID },
          }));
        }}
        style={{ flex: 1, width: SCREEN_WIDTH - 20, borderRadius: 10, marginLeft: 10, backgroundColor: '#fff', marginTop: 5 }}
      >
        <View style={{ flex: 1, flexDirection: 'row', height: 30, alignItems: 'center' }}>
          <Image source={require('../../images/alarm_company.png')} style={{ marginLeft: 10, height: 15, width: 15 }} />
          <Text style={{ marginLeft: 7, fontSize: 14, color: '#5e5d61' }} >{item.EntName}</Text>
        </View>
        <View style={{ marginLeft: 25 }}><Text style={{ marginLeft: 7, fontSize: 13, color: '#838285' }}>{item.PointName}</Text></View>
        <View style={{ marginLeft: 25, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', }}>
          <Text style={{ marginLeft: 7, fontSize: 12, color: '#5e5d61' }} >{reasonname ? reasonname.ReasonType : ''}</Text>
        </View>
        <View style={{ marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between', }}>
          <View style={{ flex: 1, flexDirection: 'row', height: 30, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#dfdfdf' }} >{item.VerifyTime.substring(11, item.VerifyTime.length)}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', height: 30, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#4498ff' }} >{'共'}</Text>
            <Text style={{ fontSize: 12, color: '#4498ff' }} >{item.Count}</Text>
            <Text style={{ fontSize: 12, color: '#4498ff' }} >{'条'}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', height: 30, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#dfdfdf' }} >{'核实人:'}</Text>
            <Text style={{ fontSize: 12, color: '#dfdfdf' }} >{item.VerifiedPerson}</Text>
          </View>
        </View>

        <View style={{ marginLeft: 30, marginBottom: 10, backgroundColor: '#ebecef', height: 80, width: SCREEN_WIDTH - 70, flexDirection: 'row', justifyContent: 'space-between', }}>
          <Text style={{ marginTop: 5, marginLeft: 5, marginBottom: 5, marginRight: 5, fontSize: 12, color: '#959494' }} >{item.VerifyMsg}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
        <SectionList
          keyExtractor={this.extraUniqueKey}
          renderSectionHeader={this.renderSectionHeader}
          ListEmptyComponent={() => (this.props.loading ? null : <View style={{ height: SCREEN_HEIGHT - 200 }}><NoDataComponent Message={'没有查询到数据'} /></View>)}
          ListFooterComponent={this.footer}
          refreshing={false}
          onRefresh={() => {
            this.props.dispatch(createAction('verified/loadverifiedlist')({
              isfirst: true,
              time: moment().format('YYYY-MM-DD')
            }));
          }}
          onEndReached={(info) => {
            if (this.props.fetchtime != null && this.props.getmoreverified) {
              this.props.dispatch(createAction('verified/loadverifiedlist')({
                isfirst: false,
                time: this.props.fetchtime
              }));
            }
          }}
          onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
          renderItem={this.renderItem}
          sections={this.props.verifiedlist}
        />
      </View>
    );
  }
}


export default VerifiedList;
