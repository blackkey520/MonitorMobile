'use strict';

import React, { Component,PureComponent} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'dva'
import { NavigationActions,createAction} from '../../utils'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FeedbackAlarmDetail from '../../components/Alarm/FeedbackAlarmDetail'
import FeedbackDetailInfo from '../../components/Alarm/FeedbackDetailInfo'
import CustomTabBar from '../../components/Common/CustomTabBar'
@connect()
class FeedbackDetail extends PureComponent {
  static navigationOptions = {
    title: '反馈详情',
    headerTintColor:'#fff',
    headerBackTitle:null,
    headerStyle:{backgroundColor:'#4f6aea'},
  }

  render() {
    return (
      <View style={styles.layout}>
        <ScrollableTabView
              // 指定单个选项卡的渲染组件
              renderTabBar={() => <CustomTabBar tabNames={['反馈详情', '报警记录']} />}
              initialPage={0}
              prerenderingSiblingsNumber={1}
          >
        <FeedbackDetailInfo  tabLabel="反馈详情"/>
        <FeedbackAlarmDetail  tabLabel="报警记录"/>
      </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({

    layout:{
      flex:1
    }
});
export default FeedbackDetail;
