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
import FeedbackAlarmList from '../../components/Alarm/FeedbackAlarmList'
import AlarmFeedbackEdit from '../../components/Alarm/AlarmFeedbackEdit'
import CustomTabBar from '../../components/Common/CustomTabBar'
@connect()
class AlarmFeedback extends PureComponent {
  static navigationOptions = {
    title: '预警反馈',
    headerTintColor:'#fff',
    headerBackTitle:null,
    headerStyle:{backgroundColor:'#4f6aea'},
  }

  render() {
    return (
      <View style={styles.layout}>
        <ScrollableTabView
              // 指定单个选项卡的渲染组件
              renderTabBar={() => <CustomTabBar tabNames={['报警反馈', '报警信息']} />}
              initialPage={0}
              prerenderingSiblingsNumber={1}
          >
        <AlarmFeedbackEdit clearselected={this.props.navigation.state.params.clearselect} selected={this.props.navigation.state.params.selected} alarmdgimn={this.props.navigation.state.params.alarmdgimn} tabLabel="报警反馈"/>
        <FeedbackAlarmList selected={this.props.navigation.state.params.selected} alarmdgimn={this.props.navigation.state.params.alarmdgimn} tabLabel="报警信息"/>
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
export default AlarmFeedback;
