'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal
} from 'react-native';
import { connect } from 'dva'
import { NavigationActions,createAction} from '../../utils'
import LoadingComponent from '../../components/Common/LoadingComponent'
import NoDataComponent from '../../components/Common/NoDataComponent'
import {MapView, Marker,Polygon} from 'react-native-amap3d';
import Swiper from 'react-native-swiper';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
@connect(({ alarm }) => ({ feedbackdetailfetching:alarm.feedbackdetailfetching,feedbackdetail:alarm.feedbackdetail}))
class FeedbackDetailInfo extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible:false,
      selectindex:0
    };
  }
  _renderPickedImage=()=>
  {
     let rtnVal=[];
      this.props.feedbackdetail.thumbimg.map((item,key)=>{
        if(item!='')
        {
          let source = { uri:item };
          rtnVal.push(
            <TouchableOpacity onPress={()=>{
              this._setModalVisible(true,key)
            }} key={key} style={{marginTop:10,marginLeft:10,width:SCREEN_WIDTH/4-20,height:SCREEN_WIDTH/4-20,borderColor:'#a3a3a3',borderWidth:1}}>
              <Image source={source} style={{width:SCREEN_WIDTH/4-20,height:SCREEN_WIDTH/4-20}}/>
            </TouchableOpacity>
          );
        }
      });
      return rtnVal;
  }
  _setModalVisible(visible,index) {

   this.setState({modalVisible: visible,selectindex:index});
  }

  render() {

    return (
      <View style={{flex:1,backgroundColor:'#fff'}}>

        {
          this.props.feedbackdetailfetching||this.props.feedbackdetail==null?
            <LoadingComponent Message={'正在加载数据'}/>
          :<View>
            <Modal
              animationType={'none'}
              transparent={true}
              visible={this.state.modalVisible}
                onRequestClose={() => {this._setModalVisible(false)}}
              >
                <Swiper height={SCREEN_HEIGHT} index={this.state.selectindex} activeDotColor={'#4f6aea'}>
                  {
                    this.props.feedbackdetail.img.map((item,key)=>{

                      if(item!='')
                      {

                        let source = { uri:item };

                        return (<TouchableOpacity onPress={()=>{

                            this._setModalVisible(false)
                        }} key={key}  style={{flex:1}}>

                        <Image   resizeMode='contain' source={source} style={styles.backgroundImage}/></TouchableOpacity>);
                      }
                    })
                  }
                </Swiper>
            </Modal>
            <View style={{width:SCREEN_WIDTH,height:130}}>
              <MapView
                     zoomLevel={14}
                     coordinate={{
                       latitude: this.props.feedbackdetail.latitude?this.props.feedbackdetail.latitude:0,
                       longitude: this.props.feedbackdetail.longitude?this.props.feedbackdetail.longitude:0,
                     }}
                     style={{flex:1}}
                      >
                        <Marker
                           icon={() =>
                             <View style={{width:20,height:20}}>
                              <Image style={{width:20,height:20,tintColor:'#8f8d8d'}} source={require('../../images/marker.png')}/>
                            </View>
                           }
                         coordinate={{
                           latitude: this.props.feedbackdetail.latitude?this.props.feedbackdetail.latitude:0,
                           longitude: this.props.feedbackdetail.longitude?this.props.feedbackdetail.longitude:0,
                         }}
                       />
                      </MapView>
            </View>

            <View style={{flexDirection:'row',height:50,alignItems: 'center',}} >
              <Text style={{marginLeft:15,fontSize:15,color:'#403e3e',borderBottomWidth:1,borderBottomColor:'#a3a3a3'}}>
                {'核实描述:'}
              </Text>
                <Text style={{marginLeft:15,fontSize:14,color:'#8f8d8d'}}>{
                  this.props.feedbackdetail.reasonName
                }</Text>
            </View>
            <View   style={{flexDirection:'row',height:50,justifyContent: 'center',alignItems: 'center',}}>
              <Image source={require('../../images/alarm_long.png')} style={{tintColor:'#0c66d4',width:20,height:20}}/>
              <Text style={{marginLeft:5,fontSize:14,color:'#443f3f'}}>{'预计恢复时间:'+this.props.feedbackdetail.recoveryTime}</Text>
            </View>
            <View style={{flexDirection:'column',width:SCREEN_WIDTH-30}}>
              <Text style={{marginLeft:15,fontSize:15,color:'#403e3e',borderBottomWidth:1,borderBottomColor:'#a3a3a3'}}>
                {'核实描述:'}
              </Text>
              <Text style={{marginLeft:15,fontSize:14,color:'#8f8d8d'}}>
                {this.props.feedbackdetail.verifyMsg}
              </Text>
            </View>

            <View  style={{width:SCREEN_WIDTH-30,marginLeft:15,marginTop:15}}>
              <View style={{flexDirection:'row',flexWrap:'wrap',alignItems: 'center',justifyContent: 'flex-start',}}>
                {this._renderPickedImage()}
              </View>
            </View>

          </View>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage:{
   flex:1,
   alignItems:'center',
   justifyContent:'center',
   width:null, 
   //不加这句，就是按照屏幕高度自适应
   //加上这几，就是按照屏幕自适应
   resizeMode:Image.resizeMode.contain,
   //祛除内部元素的白色背景
   backgroundColor:'rgba(0,0,0,0.5)',
 }
});


export default FeedbackDetailInfo;
