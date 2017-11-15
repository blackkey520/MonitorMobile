// import liraries
import React, { Component } from 'react';
import { View, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ListCompontent from '../../../components/Home/ListComponent';
import { createAction, NavigationActions } from '../../../utils';
import PollutantType from '../../../components/Home/PollutantType';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
/**
 * 监测点Tab页面
 * liz2017.11.11
 * @class PointList
 * @extends {Component}
 */
@connect(({ point, alarm, app }) => ({ unverifiedCount: alarm.unverifiedCount,
  legend: point.legend,
  pollutanttype: app.pollutanttype }))
class PointList extends Component {
 static navigationOptions = ({ navigation }) => ({
   title: '监测点位',
   tabBarLable: '点位',
   headerBackTitle: null,
   headerTintColor: '#fff',
   headerStyle: { backgroundColor: '#4f6aea' },
   headerRight: (
     <TouchableOpacity
       style={{ width: 30 }}
       onPress={() => {
         navigation.dispatch(NavigationActions.navigate({ routeName: 'QRCodeScreen' }));
       }}
     >
       <Icon name={'ios-qr-scanner'} size={28} color={'#fff'} />
     </TouchableOpacity>
   ),
   headerLeft: (
     <TouchableOpacity
       style={{ width: 30, marginLeft: 10 }}
       onPress={() => {
         navigation.dispatch(NavigationActions.navigate({ routeName: 'Search' }));
       }}
     >
       <Icon name={'ios-search'} size={28} color={'#fff'} />
     </TouchableOpacity>
   ),
   tabBarIcon: ({ focused, tintColor }) =>
     <Icon name={'ios-list-box'} size={26} color={focused ? tintColor : 'gray'} />,
 })

 render() {
   const tabnames = [];
   if (this.props.pollutanttype != null) {
     this.props.pollutanttype.map((item, key) => tabnames.push(item.Name));
   }
   return (
     <View style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH }}>
       <StatusBar
         barStyle="light-content"
       />
       <PollutantType press={(ID) => {
         this.props.dispatch(createAction('point/fetchmore')({
           loadpage: ID,
         }));
       }}
       />
       <ListCompontent />
     </View>
   );
 }
}

// const MainContent = () => (
//   <View style={{ flex: 1 }}>
//     <ListCompontent {...this.props} />
//   </View>
// );

// make this component available to the app
export default PointList;
