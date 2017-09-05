'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import MapCompontent from '../../components/Home/MapCompontent'
import ListCompontent from '../../components/Home/ListComponent'
import { Badge } from 'antd-mobile';
import { connect } from 'dva'
import { createAction, NavigationActions } from '../../utils'
import { loadStorage,saveStorage} from '../../logics/rpc';
import LoadingComponent from '../../components/Common/LoadingComponent'
import CustomTabBar from '../../components/Common/CustomTabBar'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
import dateFormat from 'dateformat'
  const now = new Date();

@connect(({ point,alarm }) => ({ fetching:point.fetching,unverifiedCount:alarm.unverifiedCount}))
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
            // <Icon name="ios-map-outline" size={30} color="#fff" />
            <Image source={require('../../images/maphead.png')} style={{height:20,width:20}}/>
            :
            // <Icon name="ios-list-box-outline" size={30} color="#fff" />
            <Image source={require('../../images/listhead.png')} style={{height:20,width:20}}/>
          }
          </TouchableOpacity>
          <TouchableOpacity onPress ={()=>{
            navigation.dispatch(NavigationActions.navigate({ routeName: 'Search' }))
          }}>
            {/* <Icon name="ios-search" size={30} color="#fff" /> */}
            <Image source={require('../../images/searchhead.png')} style={{height:20,width:20}}/>
          </TouchableOpacity>

        </View>
      )
  });
  constructor(props) {
    super(props);

    this.state = {
      pollutanttype:null
    };
  }
  async componentWillMount() {
    let pollutanttype=await loadStorage('PollutantType');
    // pollutanttype=[{ID:6,Name:'水质'},{ID:1,Name:'废水'}];
    this.setState({
      pollutanttype:pollutanttype
    });
    this.props.dispatch(createAction('point/fetchmore')({
        pollutantType:this.state.pollutanttype[0].ID
    }));
    this.props.dispatch(createAction('alarm/loadawaitchecklist')({
      isfirst:true,
        time:dateFormat(now,"yyyy-mm-dd")
    }));
  }
  _handleChangeTab=({i, ref, from })=>{
    this.props.dispatch(createAction('point/fetchmore')({
        pollutantType:this.state.pollutanttype[i].ID
    }));
  }
  render() {
    let tabnames=[];
    if(this.state.pollutanttype!=null)
    {
      this.state.pollutanttype.map((item,key)=>{
        tabnames.push(item.Name)
      });
    }

    return (
      <View style={{height:SCREEN_HEIGHT,width:SCREEN_WIDTH}}>

        <View style={styles.layout}>
          {
            this.state.pollutanttype==null?<LoadingComponent Message={'正在加载数据'}/>:
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
                   this.state.pollutanttype.map((item,key)=>{
                     return(<MainContent key={key} arraykey={key} tabLabel={item.Name} PollutantType={item.ID}  />);
                   })
                 }
            </ScrollableTabView>
          }
        </View>
        {this.props.navigation.state.params.mode=='map'?
        <View style={{position:'absolute',left:0,top:41,height:SCREEN_HEIGHT-100,width:SCREEN_WIDTH}}>
          <MapCompontent style={{height:SCREEN_HEIGHT,width:SCREEN_WIDTH}}  />
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
