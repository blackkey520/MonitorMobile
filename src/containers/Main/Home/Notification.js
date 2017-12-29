// import liraries
import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Badge } from 'antd-mobile';
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
@connect(({ app }) => ({ badge: app.badge }))
class Notification extends Component {
 static navigationOptions = ({ navigation }) => ({
   title: '我的消息',
   tabBarLable: '消息',
   headerBackTitle: null,
   headerTintColor: '#fff',
   headerStyle: { backgroundColor: '#4f6aea' },
   tabBarIcon: ({ focused, tintColor }) =>
     (<View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? -15 : 5 }}><Icon name={'ios-notifications'} size={26} color={focused ? tintColor : 'gray'} />
       {navigation.state.params ? <Badge style={{ position: 'absolute', top: 5, left: 25 }} text={navigation.state.params.badge} overflowCount={99} /> : null}</View>),
 });
 componentWillMount() {
   this.props.navigation.setParams({ badge: this.props.badge });
 }
 render() {
   return (
     <View style={{ flex: 1 }}>
       <ScrollableTabView
         // 指定单个选项卡的渲染组件
         renderTabBar={() => <CustomTabBar tabBadge={[this.props.unverifiedCount]} tabNames={['待核实', '核实记录']} />}
         initialPage={0}
         locked
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
