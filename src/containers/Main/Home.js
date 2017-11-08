

import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  StatusBar
} from 'react-native';
import { Badge } from 'antd-mobile';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MapCompontent from '../../components/Home/MapCompontent';
import ListCompontent from '../../components/Home/ListComponent';
import { createAction, NavigationActions } from '../../utils';
import CustomTabBar from '../../components/Common/CustomTabBar';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


@connect(({ point, alarm }) => ({ unverifiedCount: alarm.unverifiedCount, legend: point.legend }))
class Home extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.mode === 'map' ? '监测地图' : '设备列表',
    headerBackTitle: null,
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: '#4f6aea' },
    headerLeft: (
      <TouchableOpacity onPress={() => {
        navigation.dispatch(NavigationActions.navigate({ routeName: 'Account' }));
      }}
      >
        <Image source={require('../../images/minehead.png')} style={{ marginLeft: 10, height: 20, width: 20 }} />
      </TouchableOpacity>
    ),
    headerRight: (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: 110 }}>
        <TouchableOpacity
          style={{ width: 27 }}
          onPress={() => {
            navigation.dispatch(NavigationActions.navigate({ routeName: 'Alarm' }));
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('../../images/alarmhead.png')} style={{ height: 20, width: 20 }} />
            {
              navigation.state.params.unverifiedCount !== 0 ?
                <Badge style={{ paddingLeft: -10, paddingTop: 5 }} dot /> : null
            }
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          navigation.setParams({ mode: navigation.state.params.mode === 'map' ? 'grid' : 'map' });
        }}
        >
          {navigation.state.params.mode === 'map' ?
            <Image source={require('../../images/maphead.png')} style={{ height: 20, width: 20 }} />
            :
            <Image source={require('../../images/listhead.png')} style={{ height: 20, width: 20 }} />
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          navigation.dispatch(NavigationActions.navigate({ routeName: 'Search' }));
        }}
        >
          <Image source={require('../../images/searchhead.png')} style={{ height: 20, width: 20 }} />
        </TouchableOpacity>
      </View>
    )
  });

  handleChangeTab=({ i }) => {
    this.props.dispatch(createAction('point/fetchmore')({
      pollutantType: this.props.navigation.state.params.pollutanttype[i].ID
    }));
  }
  renderlegend=() => {
    const rtnVal = [];
    this.props.legend.map((item, key) =>
      rtnVal.push(<View keys={key} style={{ flex: 1, backgroundColor: item.Color, alignItems: 'center', justifyContent: 'center', }} key={item.Name} >
        <Text style={{ fontSize: 13 }}>{item.Name}</Text>
      </View>)
    );
    return rtnVal;
  }
  render() {
    const tabnames = [];
    if (this.props.navigation.state.params.pollutanttype != null) {
      this.props.navigation.state.params.pollutanttype.map((item, key) => tabnames.push(item.Name));
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
            initialPage={0}
            prerenderingSiblingsNumber={1}
          >
            {
              this.props.navigation.state.params.pollutanttype.map((item, key) =>
                (<MainContent
                  key={item.ID}
                  arraykey={key}
                  tabLabel={item.Name}
                  PollutantType={item.ID}
                />))
            }
          </ScrollableTabView>
        </View>
        {this.props.navigation.state.params.mode === 'map' ?
          <View style={{ position: 'absolute', left: 0, top: 41, height: Platform.OS === 'ios' ? SCREEN_HEIGHT - 100 : SCREEN_HEIGHT - 120, width: SCREEN_WIDTH }}>
            <MapCompontent style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH }} />
            <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 30 }}>
              {this.renderlegend()}
            </View>
          </View>
          : null}
      </View>

    );
  }
}

const MainContent = () => (
  <View style={{ flex: 1 }} >
    <ListCompontent {...this.props} />
  </View>
);


export default Home;
