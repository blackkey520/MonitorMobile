'use strict';

import React, { Component,PureComponent} from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

import { connect } from 'dva';
import { createAction, NavigationActions } from '../../utils';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';

@connect(({ point }) => ({ selectedpoint:point.selectedpoint }))
class PointImageComponent extends PureComponent {
  _renderImage=()=>{
    let rtnVal=[];
    this.props.selectedpoint.lowimg.map((item,key)=>{
      rtnVal.push (<Image key={key} style={styles.img} source={{uri:item}}/>);
    })
    return rtnVal;
  }
  render() {
    return (
      <View style={{backgroundColor:'#f0f0f0'}}>
        {
          this.props.selectedpoint.lowimg.length==0?
          <View style={[styles.img,{flexDirection:'column',alignItems: 'center',justifyContent: 'center',}]}>
            <Image source={require('../../images/noneimg.png')}  style={{height:70,width:100}}/>
            <Text style={{marginTop:15,color:'#716b6a'}}>{'没有图片'}</Text>
          </View>
          :
          <Swiper height={SCREEN_HEIGHT/3}   activeDotColor={'#4f6aea'}>
            {this._renderImage()}
          </Swiper>
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
img:{
  width:SCREEN_WIDTH,
  height:SCREEN_HEIGHT/3
}
});



export default PointImageComponent;
