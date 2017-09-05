'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import { connect } from 'dva'
import { createAction, NavigationActions,GetPointsCenter } from '../../utils'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
import {MapView, Marker,Polygon} from 'react-native-amap3d';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingComponent from '../Common/LoadingComponent'
import {FindMapImg} from '../../utils'
@connect(({ target,monitordata}) => ({ lastmonitorpoint:monitordata.lastmonitorpoint,targetBase:target.targetBase,datafetching:monitordata.datafetching,lastmonitordata:monitordata.lastmonitordata}))
class TargetMapComponent extends PureComponent {

  _renderLastData=(item)=>{
    let rtnVal;
    // this.props.dispatch(createAction('search/updateState')({
    //   datafetching:true,
    //   lastmonitordata:[]
    // }));
    if(this.props.lastmonitorpoint!=null&&this.props.lastmonitorpoint.DGIMN==item.Dgimn)
    {
      if(this.props.datafetching)
      {
        rtnVal=<View style={{alignItems: 'center',justifyContent: 'center',flex:1}}><Text style={{fontSize:15,color:'#747270'}}>{'正在加载中'}</Text></View>;
      }else if(this.props.lastmonitordata.length==0)
      {
        rtnVal=<View style={{alignItems: 'center',justifyContent: 'center',flex:1}}><Text style={{fontSize:15,color:'#747270'}}>{'没有查询到数据'}</Text></View>;
      }else{
        rtnVal=[];

        this.props.lastmonitordata.map((item,key)=>{
          if(key<6)
          {
            let color='#747270'
            if(item.StandardColor!=''){
              color=item.StandardColor
            }
            rtnVal.push(
              <View key={key} style={{flexDirection:'column',alignItems: 'center',
                justifyContent: 'space-around',marginTop:5,width:(SCREEN_WIDTH/2)/3,height:45}}>
                <Text style={{fontSize:14,color:color}}>
                  {item.Value}
                </Text>
                <Text style={{fontSize:11,color:'#adadad'}}>
                  {item.PollutantName}
                </Text>
              </View>
            );
          }
        })
      }
    }
    else{
      rtnVal=<View style={{alignItems: 'center',justifyContent: 'center',flex:1}}><Text style={{fontSize:15,color:'#747270'}}>{'正在加载中'}</Text></View>;
    }
    return rtnVal;
  }
  _renderDate=()=>{
    if(this.props.lastmonitordata.length!=0)
    {
      return (
        <Text style={{marginLeft:10,fontSize:12,color:'#fff'}}>
          {'监测时间:'+this.props.lastmonitordata[0]?this.props.lastmonitordata[0].Time:''}
        </Text>
      )
    }
  }


  _renderPoint=()=>{
    let rtnVal=[];

    if(this.props.targetBase.OtherInfo)
    {
      this.props.targetBase.OtherInfo.map((item,key)=>{
        const color=item.status==0?'#b0b0b1':
        item.status==1?'#2bbf1e':
        item.status==2?'#ff5e5e':'#b9c305';

        let img=FindMapImg(item.imgName)
        rtnVal.push(<Marker
           key={key}
           onPress={()=>{
             this.props.dispatch(createAction('monitordata/searchlastdata')({dgimn:item.Dgimn}));
           }}

           icon={() =>
             <View style={{width:20,height:20}}>
              {/* <Image style={{width:20,height:20,tintColor:color}} source={require('../../images/marker.png')}/> */}
              <Image style={{width:20,height:20}} source={img}/>
            </View>
           }
         coordinate={{
           latitude: item.Latitude,
           longitude: item.Longitude,
         }}
       >
         <View style={{alignItems: 'center',height:SCREEN_WIDTH/2+60,borderColor:'#c3cdbf',borderRadius:7,borderWidth:1,
           flexDirection:'column',width:SCREEN_WIDTH/2+20,backgroundColor:'white'}}>
           <View style={{justifyContent: 'space-around', height:90,width:SCREEN_WIDTH/2+20,backgroundColor:'#6395ff'
           ,borderBottomWidth:2,borderBottomColor:'#356fe8'}}>
             <Text style={{marginLeft:10,fontSize:15,color:'#fff'}}>
               {this.props.targetBase.TargetInfo.TargetName}
             </Text>
             <Text style={{marginLeft:10,fontSize:13,color:'#fff'}}>
               {item.PointName}
             </Text>
             {
               this.props.lastmonitorpoint!=null&&this.props.lastmonitorpoint.DGIMN==item.Dgimn?this._renderDate():null
             }
           </View>
           <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',width:SCREEN_WIDTH/2+10}}>
              {this._renderLastData(item)}
           </View>

             <TouchableOpacity onPress={()=>{
               this.props.dispatch(createAction('point/selectpoint')({
                dgimn:item.Dgimn
              }));
              this.props.dispatch(NavigationActions.navigate({
                routeName: 'MonitorPoint',params:{dgimn:item.Dgimn}
              }));
             }} style={{justifyContent: 'center', height:25,marginBottom:5,
               backgroundColor:'#6996ff',borderRadius:7,alignItems: 'center',width:SCREEN_WIDTH/2-10}}>
               <Text style={{color:'#fff',fontSize:13}}>
                 {'查看详情'}
               </Text>
             </TouchableOpacity>

         </View>

       </Marker>);
     })
    }
    return rtnVal;
  }
  // componentDidMount(){
  //   let coordinateset=GetPointsCenter(this.props.targetBase.TargetInfo.CoordinateJson);
  //   if(coordinateset!=null)
  //   {
  //     this.mapView.animateTo({
  //       tilt: 0,
  //       rotation: 0,
  //       zoomLevel: 14,
  //       coordinate:coordinateset
  //     })
  //   }
  // }
  render() {
    let coordinateset=GetPointsCenter(this.props.targetBase.TargetInfo.CoordinateJson);
    if(coordinateset!=null)
    {
      return (
        <View style={{flex:1}}>
          <MapView
            ref={ref => this.mapView = ref}
            rotateEnabled={true}
            tiltEnabled={true}
            zoomLevel={13}
            coordinate={coordinateset}
            style={StyleSheet.absoluteFill}>
            <Polygon
            strokeWidth={2}
            fillColor='rgba(0, 0, 0, 0)'
            strokeColor='#108ee9'
            coordinates={this.props.targetBase.TargetInfo.CoordinateJson}/>
            {this._renderPoint()}
          </MapView>
        </View>
      );
    }
    else{
      return (
        <View style={{flex:1}}>
          <MapView
            ref={ref => this.mapView = ref}
            rotateEnabled={true}
            tiltEnabled={true}
            style={StyleSheet.absoluteFill}>
            <Polygon
            strokeWidth={2}
            fillColor='rgba(0, 0, 0, 0)'
            strokeColor='#108ee9'
            coordinates={this.props.targetBase.TargetInfo.CoordinateJson}/>
            {this._renderPoint()}
          </MapView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  customIcon: {
    width: 30,
    height: 30,
  },
});


export default TargetMapComponent;
