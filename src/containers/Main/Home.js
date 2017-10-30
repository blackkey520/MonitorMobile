'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import MapCompontent from '../../components/Home/MapCompontent'
import ListCompontent from '../../components/Home/ListComponent'
import { Badge } from 'antd-mobile';
import { connect } from 'dva'
import { createAction, NavigationActions } from '../../utils'
import LoadingComponent from '../../components/Common/LoadingComponent'
import CustomTabBar from '../../components/Common/CustomTabBar'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
import moment from 'moment'

@connect(({point, alarm, app}) => ({pollutanttype: app.pollutanttype, fetching: point.fetching, unverifiedCount: alarm.unverifiedCount, legend: point.legend}))
class Home extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
      headerTitle: navigation.state.params.mode=='map'?'监测地图':'设备列表',
      headerBackTitle:null,
      headerTintColor:'#fff',
      headerStyle:{backgroundColor:'#4f6aea'},
      headerLeft: (
        <TouchableOpacity onPress ={()=>{
          navigation.dispatch(NavigationActions.navigate({ routeName: 'Account' }))

        }}>
          {/* <Icon name="ios-person-outline" style={{marginLeft:10}} size={30} color="#fff" /> */}
          <Image source={require('../../images/minehead.png')} style={{marginLeft:10,height:20,width:20}}/>
        </TouchableOpacity>
      ),
      headerRight: (
        <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-around',width:110}}>
          <TouchableOpacity style={{width:27}} onPress ={()=>{
            navigation.dispatch(createAction('warn/loadwarnlist')({
              isfirst:true,
              time:moment().format('YYYY-MM-DD')
            }));
            navigation.dispatch(NavigationActions.navigate({ routeName: 'Alarm' }))
          }}>
            <View style={{flexDirection:'row'}}>
              {/* <Icon name="ios-notifications-outline" size={30} color="#fff" /> */}
              <Image source={require('../../images/alarmhead.png')} style={{height:20,width:20}}/>
              {
                navigation.state.params.unverifiedCount!=0?<Badge style={{paddingLeft:-10,paddingTop:5}} dot />:null
              }
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress ={()=>{
            navigation.setParams({ mode: navigation.state.params.mode === 'map' ? 'grid' : 'map' })
          }}>
            {navigation.state.params.mode === 'map' ?
            <Image source={require('../../images/maphead.png')} style={{height:20,width:20}}/>
            :
            <Image source={require('../../images/listhead.png')} style={{height:20,width:20}}/>
          }
          </TouchableOpacity>
          <TouchableOpacity onPress ={()=>{
            navigation.dispatch(NavigationActions.navigate({ routeName: 'Search' }))
          }}>
            <Image source={require('../../images/searchhead.png')} style={{height:20,width:20}}/>
          </TouchableOpacity>

        </View>
      )
  });

  _handleChangeTab=({i, ref, from })=>{
    this.props.dispatch(createAction('point/fetchmore')({
        pollutantType:this.props.pollutanttype[i].ID
    }));
  }
  _renderlegend=()=>{
    let rtnVal=[];
    this.props.legend.map((item,key)=>{
      rtnVal.push(<View style={{flex:1,backgroundColor:item.Color,alignItems: 'center',justifyContent: 'center',}} key={item.Name} >
        <Text style={{fontSize:13}}>{item.Name}</Text>
      </View>);
    });
    return rtnVal;
  }
  render() {
    let tabnames=[];
    if(this.props.pollutanttype!=null)
    {
      this.props.pollutanttype.map((item,key)=>{
        tabnames.push(item.Name)
      });
    }
    return (
      <View style={{height:SCREEN_HEIGHT,width:SCREEN_WIDTH}}>
       <StatusBar 
     barStyle="light-content"
   />
        <View style={styles.layout}>
            <ScrollableTabView
              tabBarBackgroundColor={'#fff'}
              tabBarUnderlineStyle={{backgroundColor:'#108ee9',height:1}}
              locked={false}
                onChangeTab={this._handleChangeTab}
                renderTabBar={() => <CustomTabBar tabNames={tabnames} />}
                initialPage={0}
                prerenderingSiblingsNumber={1}
               >
                 {
                   this.props.pollutanttype.map((item,key)=>{
                     return(<MainContent key={key} arraykey={key} tabLabel={item.Name} PollutantType={item.ID}  />);
                   })
                 }
            </ScrollableTabView>
        </View>
        {this.props.navigation.state.params.mode=='map'?
        <View style={{position:'absolute',left:0,top:41,height:Platform.OS === 'ios'?SCREEN_HEIGHT-100:SCREEN_HEIGHT-120,width:SCREEN_WIDTH}}>
          <MapCompontent style={{height:SCREEN_HEIGHT,width:SCREEN_WIDTH}}  />
          <View style={{flexDirection:'row',width:SCREEN_WIDTH,height:30}}>
            {this._renderlegend()}
          </View>
        </View>
        :null}
      </View>

    );
  }
}

class MainContent extends PureComponent {
  render() {
    return (
      <View style={styles.layout}>
           <ListCompontent {...this.props}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
layout:{
  flex:1
}
});


export default Home;
