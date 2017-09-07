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
import UnVerifiedList from '../../components/Alarm/UnVerifiedList'
import VerifiedHistory from '../../components/Alarm/VerifiedHistory'
import CustomTabBar from '../../components/Common/CustomTabBar'

import moment from 'moment'
@connect(({ alarm }) => ({ unverifiedCount:alarm.unverifiedCount}))
class Alarm extends PureComponent {
  static navigationOptions = {
    title: '报警核实',
    headerTintColor:'#fff',
    headerBackTitle:null,
    headerStyle:{backgroundColor:'#4f6aea'},
  }

  _handleChangeTab=({i, ref, from })=>{
    if(i==0)
    {
      this.props.dispatch(createAction('alarm/loadawaitchecklist')({
        isfirst:true,
          time:moment().format('YYYY-MM-DD')
      }));
    }else{
      this.props.dispatch(createAction('alarm/loadverifiedlist')({
        isfirst:true,
          time:moment().format('YYYY-MM-DD')
      }));
    }
  }
  render() {
    return (
      <View style={styles.layout}>
        <ScrollableTabView
              // 指定单个选项卡的渲染组件
              renderTabBar={() => <CustomTabBar tabBadge={[this.props.unverifiedCount]}  tabNames={['待核实', '核实记录']} />}
              initialPage={0}
              onChangeTab={this._handleChangeTab}
              prerenderingSiblingsNumber={1}
          >
        <UnVerifiedList tabLabel="待核实"/>
        <VerifiedHistory tabLabel="核实记录"/>
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
export default Alarm;
