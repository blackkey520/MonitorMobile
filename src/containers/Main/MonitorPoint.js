'use strict';

import React, { Component,PureComponent} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  Platform
} from 'react-native';
import { connect } from 'dva'

import { createAction,NavigationActions,ShowLoadingToast,CloseToast,ShowResult } from '../../utils'
import { Toast,List ,Button} from 'antd-mobile';
import Icon from 'react-native-vector-icons/Ionicons';
import PointImageComponent from '../../components/Point/PointImageComponent'
import PointBaseMessage from '../../components/Point/PointBaseMessage'
import HistoryData from '../../components/Point/HistoryData'
import LoadingComponent from '../../components/Common/LoadingComponent'
import ImagePicker  from 'react-native-image-picker'
import CustomTabBar from '../../components/Common/CustomTabBar'
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import pointMenu from '../../config/pointMenu.json'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
var options = {
  title: '选择照片',
  cancelButtonTitle:'关闭',
  takePhotoButtonTitle:'打开相机',
  chooseFromLibraryButtonTitle:'选择照片',
  quality:0.1,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
@connect(({ point }) => ({ fetching:point.fetching}))
class MonitorPoint extends PureComponent {

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: '监控点位',
        headerBackTitle:null,
        headerTintColor:'#fff',
        headerStyle:{backgroundColor:'#4f6aea'}
    });

  _handleChangeTab=({i, ref, from })=>{

  }

  render() {

    let tabnames=[];
    pointMenu.map((item,key)=>{
      tabnames.push(item.pointMenuName);
    });
    return (
      <View style={styles.layout}>
        {
           this.props.fetching?
          <LoadingComponent Message='正在加载数据'/>
          :
          <ScrollableTabView
            tabBarBackgroundColor={'#fff'}
            tabBarUnderlineStyle={{backgroundColor:'#108ee9',height:1}}
              onChangeTab={this._handleChangeTab}
              renderTabBar={() => <CustomTabBar tabNames={tabnames} />}
              removeClippedSubviews={false}
              initialPage={0}
              prerenderingSiblingsNumber={1}
             >
               {
                 pointMenu.map((item,key)=>{
                   if(key==0)
                   {
                     return(<PointDetail
                        key={item.pointMenuID} tabLabel={item.pointMenuName}    />);
                   }
                   else if(key==1)
                   {
                     return(<HistoryData  navdgimn={this.props.navigation.state.params.dgimn}
                       key={item.pointMenuID} tabLabel={item.pointMenuName}  />);
                   }
                 })
               }
          </ScrollableTabView>
        }
      </View>
    );
    /* {this.props.selectedpoint.Photos.length} */
  }
}

@connect(({ point }) => ({selectedpoint:point.selectedpoint }))
class PointDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collect:false
    };
  }

  _callback=(state)=>{
    this.setState({
      collect:state
    });
  }
  _uploadsuccess=()=>{
    CloseToast();
    ShowResult(true,'上传成功');
  }
    render() {
      return (
        <ScrollView >
          <PointImageComponent />
                 <View style={{flexDirection:'row',justifyContent: 'space-around',width:65, position:'absolute',top:10,left:SCREEN_WIDTH-70}}>
                   <TouchableOpacity onPress={()=>{
                     this.props.dispatch(createAction('point/collectpoint')({dgimn:this.props.selectedpoint.Point.Dgimn,callback:this._callback}));
                   }}>
                     {this.props.selectedpoint.Point.CollectStatus==1?
                       <Image source={require('../../images/collect_press.png')} style={{width:25,height:25}} />
                       :<Image source={require('../../images/collect_on.png')} style={{width:25,height:25}} />}
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=>{
                     ImagePicker.showImagePicker(options, (response) => {
                       if (response.didCancel) {
                         console.log('User cancelled image picker');
                       }
                       else if (response.error) {
                         console.log('ImagePicker Error: ', response.error);
                       }
                       else if (response.customButton) {
                         console.log('User tapped custom button: ', response.customButton);
                       }
                       else {
                         ShowLoadingToast('正在上传图片');
                           this.props.dispatch(createAction('point/uploadimage')({
                             image:response,
                             dgimn:this.props.selectedpoint.Point.Dgimn,
                             callback:this._uploadsuccess
                           }));
                       }
                     });
                   }}>
                   <Image source={require('../../images/photo_on.png')} style={{width:25,height:25}} />
                 </TouchableOpacity>
                 </View>
          <PointBaseMessage />
        </ScrollView>
      );
  }
}


const styles = StyleSheet.create({
  layout:{
    flex:1
  }
});


export default MonitorPoint;
