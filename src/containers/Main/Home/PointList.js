// import liraries
import React, { Component } from 'react';
import { View, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ListCompontent from '../../../components/Home/ListComponent';
import { createAction, NavigationActions } from '../../../utils';
import CustomTabBar from '../../../components/Common/CustomTabBar';

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
  page: point.page,
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
     <Icon name={'ios-list-box'} size={26} color={focused ? tintColor : 'gray'} />
 })
  handleChangeTab=({ i }) => {
    this.props.dispatch(createAction('point/fetchmore')({
      page: i
    }));
  }
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
        <View style={{ flex: 1 }}>
          <ScrollableTabView
            tabBarBackgroundColor={'#fff'}
            tabBarUnderlineStyle={{ backgroundColor: '#108ee9', height: 1 }}
            locked={false}
            onChangeTab={this.handleChangeTab}
            renderTabBar={() => <CustomTabBar tabNames={tabnames} />}
            page={this.props.page}
            initialPage={0}
            prerenderingSiblingsNumber={1}
          >
            {
              this.props.pollutanttype.map((item, key) =>
                (<MainContent
                  key={item.ID}
                  arraykey={key}
                  tabLabel={item.Name}
                  PollutantType={item.ID}
                />))
            }
          </ScrollableTabView>
        </View>
      </View>
    );
  }
}

const MainContent = () => (
  <View style={{ flex: 1 }}>
    <ListCompontent {...this.props} />
  </View>
);

// make this component available to the app
export default PointList;
