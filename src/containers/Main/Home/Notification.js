// import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import WarnList from '../../../components/Alarm/WarnList';
import VerifiedList from '../../../components/Alarm/VerifiedList';
import CustomTabBar from '../../../components/Common/CustomTabBar';
/**
 * 消息Tab页面
 * liz 2017.11.11
 * @class Notification
 * @extends {Component}
 */
@connect()
class Notification extends Component {
  static navigationOptions={
    title: '我的消息',
    tabBarLable: '消息',
    headerBackTitle: null,
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: '#4f6aea' },
    tabBarIcon: ({ focused, tintColor }) =>
      <Icon name={'ios-notifications'} size={26} color={focused ? tintColor : 'gray'} />
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollableTabView
          // 指定单个选项卡的渲染组件
          renderTabBar={() => <CustomTabBar tabBadge={[this.props.unverifiedCount]} tabNames={['待核实', '核实记录']} />}
          initialPage={0}
          prerenderingSiblingsNumber={1}
        >
          <WarnList tabLabel="待核实" />
          <VerifiedList tabLabel="核实记录" />
        </ScrollableTabView>
      </View>
    );
  }
}

// make this component available to the app
export default Notification;
