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
import { createAction, NavigationActions } from '../../utils'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
import {MapView, Marker,Polygon} from 'react-native-amap3d';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingComponent from '../Common/LoadingComponent'
import {FindMapImg} from '../../utils'
@connect(({ point }) => ({ result:point.result }))
class MapCompontent extends PureComponent {

  _renderPoint=()=>{
    let rtnVal=[];
    if(this.props.result)
    {
      this.props.result.map((item,key)=>{

        rtnVal.push(<CustomMarker  key={item.dgimn} markerItem={item} />);
     })
    }
    return rtnVal;
  }

  render() {
    return (
      <View style={{flex:1}}>
        <MapView
          ref={ref => this.mapView = ref}
          rotateEnabled={true}
          tiltEnabled={true}
          style={StyleSheet.absoluteFill}>
          {this._renderPoint()}
        </MapView>

      </View>
    );
  }
}


@connect(({ monitordata }) => ({ lastmonitorpoint:monitordata.lastmonitorpoint,lastmonitordata:monitordata.lastmonitordata,
  datafetching:monitordata.datafetching }))
class CustomMarker extends PureComponent{
  _renderLastData=()=>{

    let rtnVal;
    // this.props.dispatch(createAction('search/updateState')({
    //   datafetching:true,
    //   lastmonitordata:[]
    // }));
    if(this.props.lastmonitorpoint!=null&&this.props.lastmonitorpoint.DGIMN==this.props.markerItem.dgimn)
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
          {'监测时间:'+this.props.lastmonitordata[0].Time}
        </Text>
      )
    }
  }

  render(){

    const color=this.props.markerItem.status==0?'#b0b0b1':
    this.props.markerItem.status==1?'#2bbf1e':
    this.props.markerItem.status==2?'#ff5e5e':'#b9c305';
    let img=FindMapImg(this.props.markerItem.imgName)

    return(
      <Marker

         onPress={()=>{

           this.props.dispatch(createAction('monitordata/searchlastdata')({dgimn:this.props.markerItem.dgimn}));
         }}
        //  title={item.targetName}
         icon={() =>
           <View style={{width:20,height:20}}>
            {/* <Image style={{width:20,height:20,tintColor:color}} source={require('../../images/marker.png')}/> */}
            <Image style={{width:20,height:20}} source={img}/>
          </View>
         }
       coordinate={{
         latitude: this.props.markerItem.latitude,
         longitude: this.props.markerItem.longitude,
       }}
     >
       <View style={{alignItems: 'center',height:SCREEN_WIDTH/2+60,borderColor:'#c3cdbf',borderRadius:7,borderWidth:1,
         flexDirection:'column',width:SCREEN_WIDTH/2+20,backgroundColor:'white'}}>
         <View style={{justifyContent: 'space-around', height:90,width:SCREEN_WIDTH/2+20,backgroundColor:'#6395ff'
         ,borderBottomWidth:2,borderBottomColor:'#356fe8'}}>
           <Text style={{marginLeft:10,fontSize:15,color:'#fff'}}>
             {this.props.markerItem.targetName}
           </Text>
           <Text style={{marginLeft:10,fontSize:13,color:'#fff'}}>
             {this.props.markerItem.pointName}
           </Text>
           {
             this.props.lastmonitorpoint!=null&&this.props.lastmonitorpoint.DGIMN==this.props.markerItem.dgimn?this._renderDate():null
           }
         </View>
         <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',width:SCREEN_WIDTH/2+10}}>
            {this._renderLastData()}
         </View>

           <TouchableOpacity onPress={()=>{
             this.props.dispatch(createAction('point/selectpoint')({
               dgimn:this.props.markerItem.dgimn
             }));
           }} style={{justifyContent: 'center', height:25,marginBottom:5,
             backgroundColor:'#6996ff',borderRadius:7,alignItems: 'center',width:SCREEN_WIDTH/2-10}}>
             <Text style={{color:'#fff',fontSize:13}}>
               {'查看详情'}
             </Text>
           </TouchableOpacity>

       </View>
     </Marker>
    );
  }
}
const styles = StyleSheet.create({
  customIcon: {
    width: 30,
    height: 30,
  },
});


export default MapCompontent;
