'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { connect } from 'dva'
import { Button ,TextareaItem,DatePicker } from 'antd-mobile';
import WarningReason from '../../config/configjson/WarningReason.json';
import LoadingComponent from '../../components/Common/LoadingComponent'
import 'moment/locale/zh-cn';
import moment from 'moment';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
const zhNow = moment().locale('zh-cn').utcOffset(8);
import { createAction, NavigationActions,ShowToast,ShowResult,ShowLoadingToast,CloseToast} from '../../utils'
import ImagePicker  from 'react-native-image-picker'
import MapView from 'react-native-amap3d'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
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
@connect(({ alarm }) => ({ imagelist:alarm.imagelist,isuploading:alarm.isuploading,uploadimageID:alarm.uploadimageID}))
class AlarmFeedbackEdit extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      refresh:false,
      WarningReason:WarningReason[0],
      sceneDescription:'',
      RecoveryTime:moment().add(WarningReason[0].EstimatedTime,'hours'),
      longitude:0,
      latitude:0,
      imagelist:[]
    };
  }
  _renderWarningReason=()=>{
    let rtnVal=[];
    WarningReason.map((item,key)=>{
      rtnVal.push(<Button key={key} style={{marginLeft:10}} type={this.state.WarningReason!=null&&
        this.state.WarningReason.ID==item.ID?'primary':'ghost'} size="small" onClick={()=>{
        let time=moment().add(item.EstimatedTime,'hours');
        this.setState({
          WarningReason:item,
          RecoveryTime:time
        });
      }}>{item.ReasonType}</Button>);
    });
    return rtnVal;
  }
  _onDateChange=(date)=>{
    this.setState({
      RecoveryTime:date
    });
  }

  _renderPickedImage=()=>
  {
     let rtnVal=[];
      this.state.imagelist.map((item,key)=>{
        let source = { uri: item.uri };
        rtnVal.push(
          <View key={key} style={{marginTop:10,marginLeft:10,width:SCREEN_WIDTH/4-20,height:SCREEN_WIDTH/4-20,borderColor:'#a3a3a3',borderWidth:1}}>
            <Image source={source} style={{width:SCREEN_WIDTH/4-20,height:SCREEN_WIDTH/4-20}}/>
            <TouchableOpacity onPress={()=>{
                // this.props.dispatch(createAction('alarm/removeimage')({
                //   image:item,
                //   callback:this._delcallback
                // }));
                this.setState((state) => {
                  // copy the map rather than modifying state.
                  const imagelist = state.imagelist;
                  let removeIndex=state.imagelist.findIndex((value, index, arr)=>{
                    return value.uploadID==item.uploadID;
                  })
                  imagelist.splice(removeIndex,1)
                  const refresh=!state.refresh;
                  return {imagelist,refresh};
                });
            }} style={[ {position:'absolute',top:0,left:(SCREEN_WIDTH/4-35)}]}>
                <Icon  style={{backgroundColor:'rgba(0,0,0,0)'}} name="ios-close-outline" size={25} color={'#a3a3a3'}   />
            </TouchableOpacity>
          </View>
        );
      });
      return rtnVal;
  }
  _scrollToInput =(reactNode: any)=>{
  // Add a 'scroll' ref to your ScrollView
  this.refs.scroll.scrollToPosition(0, 130, false)
  }
  _logLocationEvent = ({nativeEvent}) =>{
    this.setState({
      longitude:nativeEvent.longitude,
      latitude:nativeEvent.latitude
    });
  }
  _feedbackCallback=()=>{
    this.props.clearselected();
    this.props.dispatch(NavigationActions.back());
    CloseToast()
    ShowResult(true,'反馈成功')
  }
  _uploadImageCallBack=(img)=>{

    this.setState((state) => {
      // copy the map rather than modifying state.
      const imagelist = state.imagelist;
      const refresh=!state.refresh;
      imagelist.push(img);
      return {imagelist,refresh};
    });
    CloseToast();
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'#fff'}}>
       <View>
            <KeyboardAwareScrollView ref='scroll'>
              <View style={{width:SCREEN_WIDTH,height:130}}>
                <MapView
                       locationEnabled
                       zoomLevel={14}
                       coordinate={{
                         latitude: this.state.latitude,
                         longitude: this.state.longitude,
                       }}
                       onLocation={this._logLocationEvent}
                       style={{flex:1}}
                        />
              </View>
            <View style={{flexDirection:'row',height:50,alignItems: 'center',justifyContent: 'center',flexWrap:'wrap'}} >
                {this._renderWarningReason()}
            </View>
            <DatePicker
              mode="datetime"
              extra="请选择(可选)"
              title={<Text>{''}</Text>}
              onChange={this._onDateChange}
              value={this.state.RecoveryTime}
            >
              <TimeComponent/>
            </DatePicker>
            <View style={{flexDirection:'column',width:SCREEN_WIDTH-30}}>
              <Text style={{marginLeft:15,fontSize:15,color:'#403e3e',borderBottomWidth:1,borderBottomColor:'#a3a3a3'}}>
                {'核实描述:'}
              </Text>
               <TextareaItem
                  rows={5}
                  count={200}
                  onFocus={(event: Event) => {
                    // `bind` the function if you're using ES6 classes
                    this._scrollToInput(ReactNative.findNodeHandle(event.target))
                  }}
                  value={this.state.sceneDescription}
                  onChange={(text)=>{
                    this.setState({
                      sceneDescription:text
                    });
                  }}
                />
            </View>
            <View  style={{width:SCREEN_WIDTH-30,marginLeft:15,marginTop:15}}>
              <View style={{flexDirection:'row',flexWrap:'wrap',alignItems: 'center',justifyContent: 'flex-start',}}>
                {this._renderPickedImage()}
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
                      let imageIndex=this.state.imagelist.findIndex((value, index, arr)=>{
                        return value.origURL==response.origURL;
                      })
                      if(imageIndex==-1)
                      {
                        this.props.dispatch(createAction('alarm/uploadimage')({
                          image:response,
                          callback:this._uploadImageCallBack
                        }));
                      }
                      else{
                        ShowToast('图片已经在列表中');
                      }
                    }
                  });
                }} style={{marginTop:10,marginLeft:10,width:SCREEN_WIDTH/4-20,height:SCREEN_WIDTH/4-20,borderColor:'#a3a3a3'
                ,borderWidth:1,alignItems: 'center',justifyContent: 'center',}}>
                  <Icon  style={{backgroundColor:'rgba(0,0,0,0)'}} name="ios-add-outline" size={70} color={'#a3a3a3'}   />
                </TouchableOpacity>
              </View>
            </View>
             {/* <Button style={{ width:280 }} className="btn" type="primary" loading>正在登陆</Button>  */}
            <View style={{marginTop:15,width:SCREEN_WIDTH,alignItems: 'center',justifyContent: 'center',}}>
              <Button className="btn" style={{ width:180 }} type="primary" onClick={()=>{
                ShowLoadingToast('正在提交')
                let paramExceptionProcessingID="";
                let paramImageID="";
                this.props.selected.forEach(function (item, key, mapObj) {
                    paramExceptionProcessingID+=key.toString()+','
                });

                this.state.imagelist.map((item,key)=>{
                  paramImageID+=item.uploadID+','
                });
                this.props.dispatch(createAction('alarm/postfeedback')({
                  postjson:{
                    DGIMN:this.props.alarmdgimn,
                    ExceptionProcessingID:paramExceptionProcessingID,
                    WarningReason:this.state.WarningReason.ID,
                    sceneDescription:this.state.sceneDescription,
                    ImageID:paramImageID,
                    feedbackTime:moment().format('YYYY-MM-DD HH:mm:ss'),
                    RecoveryTime:this.state.RecoveryTime.format('YYYY-MM-DD HH:mm:ss'),
                    longitude:this.state.longitude,
                    latitude:this.state.latitude
                  },
                   callback:this._feedbackCallback
                }));
              }} >提交</Button>
            </View>
          </KeyboardAwareScrollView>

        </View>
      </View>
    );
  }
}
const TimeComponent =props=>(
      <TouchableOpacity onPress={props.onClick} style={{flexDirection:'row',height:50,justifyContent: 'center',alignItems: 'center',}}>
        <Image source={require('../../images/alarm_long.png')} style={{tintColor:'#0c66d4',width:20,height:20}}/>
        <Text style={{marginLeft:5,fontSize:14,color:'#443f3f'}}>{'预计恢复时间:'+props.extra}</Text>
      </TouchableOpacity>
    );
const styles = StyleSheet.create({

});


export default AlarmFeedbackEdit;
