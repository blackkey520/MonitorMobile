// import liraries
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import MapCompontent from '../../../components/Home/MapCompontent';
import { createAction, NavigationActions } from '../../../utils';
import PollutantType from '../../../components/Home/PollutantType';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * 监控地图Tab页
 * liz 2017.11.11
 * @class MonitorMap
 * @extends {Component}
 */
@connect(({ point, alarm, app }) => ({ unverifiedCount: alarm.unverifiedCount,
  legend: point.legend,
  pollutanttype: app.pollutanttype,
  page: point.page,
}))
class MonitorMap extends Component {
 static navigationOptions = ({ navigation }) => ({
   title: '监测地图',
   tabBarLable: '地图',
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
     <Icon name={'ios-map'} size={26} color={focused ? tintColor : 'gray'} />,
 })

     renderlegend=() => {
       const rtnVal = [];
       this.props.legend.map((item, key) =>
         rtnVal.push(<View keys={key} style={{ flex: 1, backgroundColor: item.Color, alignItems: 'center', justifyContent: 'center' }} key={item.Name} >
           <Text style={{ fontSize: 13 }}>{item.Name}</Text>
         </View>)
       );
       return rtnVal;
     }
     render() {
       const tabnames = [];
       if (this.props.pollutanttype != null) {
         this.props.pollutanttype.map((item, key) => tabnames.push(item.Name));
       }

       return (
         <View style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH }}>
           <PollutantType press={(ID) => {
             this.props.dispatch(createAction('point/fetchmore')({
               loadpage: ID,
             }));
           }}
           />
           <View style={{ height: SCREEN_HEIGHT - 41, width: SCREEN_WIDTH }}>
             <MapCompontent style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH }} />
             <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 30 }}>
               {this.renderlegend()}
             </View>
           </View>
         </View>

       );
     }
}


// make this component available to the app
export default MonitorMap;
