'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ListView
} from 'react-native';
import { connect } from 'dva'
import { createAction, NavigationActions } from '../../utils'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;

@connect(({ search }) => ({ fetching:search.fetching,searchText:search.searchText,result:search.result }))
class ResultCompontent extends PureComponent {
  ds = new ListView.DataSource({ rowHasChanged: (v1, v2) => v1 !== v2 });
  constructor(props) {
    super(props);

      this.dataSource = [];
        this.state = {
            current:0,

        };
  }

  _renderDetail=(text)=>{
    let rtnVal=[];
    let searchArray=this.props.searchText.split("");
    let newtext=text;
    searchArray.map((item,key)=>{
      newtext=newtext.replace(item,'|&'+item+'|');
    });
    let textArray=newtext.split("&#&");
    let finalStr='';
    if(textArray[1]=='1')
    {
      finalStr=textArray[2]!=''?'企业名称:'+textArray[2]:''
          finalStr+=textArray[5]!=''?';地区:'+textArray[5]:''
          finalStr+=textArray[7]!=''?';企业地址:'+textArray[7]:''
          finalStr+=textArray[8]!=''?';控制级别:'+textArray[8]:''
          finalStr+=textArray[9]!=''?';联系人:'+textArray[9]:''
          finalStr+=textArray[16]!=''?';流域:'+textArray[16]:'';
    }else if(textArray[1]=='2')
    {
      finalStr=textArray[2]!=''?'河段、工地:'+textArray[2]:''
          finalStr+=textArray[5]!=''?';地区:'+textArray[5]:''
          finalStr+=textArray[9]!=''?';联系人:'+textArray[9]:''
          finalStr+=textArray[16]!=''?';流域:'+textArray[16]:'';
    }else if(textArray[1]=='3')
    {
      finalStr=textArray[2]!=null?'排口名称:'+textArray[2]:''
          finalStr+=textArray[6]!=''?';企业名称:'+textArray[6]:''
          finalStr+=textArray[8]!=''?';企业地址:'+textArray[8]:''
          finalStr+=textArray[10]!=''?';联系人:'+textArray[10]:''
          finalStr+=textArray[13]!=''?';控制级别:'+textArray[13]:''
          finalStr+=textArray[16]!=''?';运维人:'+textArray[16]:''
          finalStr+=textArray[22]!=''?';地区:'+textArray[22]:'';
    } else if(textArray[1]=='4')
    {
      finalStr=textArray[2]!=''?'监测点名称:'+textArray[2]:''
          finalStr+=textArray[6]!=''?';河段、工地:'+textArray[6]:''
          finalStr+=textArray[9]!=''?';联系人:'+textArray[9]:''
          finalStr+=textArray[13]!=''?';运维人:'+textArray[13]:''
          finalStr+=textArray[19]!=''?';地区:'+textArray[19]:'';
    }
    let renderArray=finalStr.split("|");
    renderArray.map((item,key)=>{
      if(item.indexOf('&')!=-1)
      {
        rtnVal.push(<Text key={key} style={{color:'red',fontSize:13}}>{item.substring(1,item.length)}</Text>);
      }else{
        rtnVal.push(<Text key={key}  style={{color:'#716b6a',fontSize:13}}>{item}</Text>);
      }
    });
    return rtnVal;
  }
  //  单行渲染方法
  _renderRow = (rowData, sectionID, rowID, highlightRow)=>{
    const img=rowData.Type==1?
    require('../../images/type_conmpany.png'):rowData.lable=='2'?
    require('../../images/type_county.png'):rowData.lable=='3'?
    require('../../images/type_station.png'):rowData.lable=='4'?
    require('../../images/search_icon.png'):require('../../images/type_point.png')
    return(
     //  需要二级查询的ListView行组件渲染
     <TouchableOpacity onPress={()=>{
       let otherArray=rowData.OtherInfo.split('&#&');
       if(rowData.Type==1||rowData.Type==2||rowData.Type==3||rowData.Type==4)
       {
         this.props.dispatch(createAction('target/selecttarget')({
           targetCode:otherArray[0],
           baseType:rowData.Type
         }));
       }else{
         this.props.dispatch(createAction('point/selectpoint')({
           dgimn:otherArray[5]
         }));
       }
     }} style={{width:SCREEN_WIDTH-16,backgroundColor:'white',marginTop:5,marginLeft:8,borderRadius:5,flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',}}>
       <View style={{width:SCREEN_WIDTH-32,flexDirection:'column'}}>
         <View style={{width:SCREEN_WIDTH-32,height:55,flexDirection:'row',
           alignItems: 'center',justifyContent: 'flex-start'}}>
           <View style={{width:40,height:40,alignItems: 'center',justifyContent: 'center',marginLeft:15,borderRadius:30}}>
             <Image source={img} style={{
                 width: 25,
                 height: 25
             }}/>
           </View>
           <View style={{marginLeft:15}}>
               <Text style={{fontSize:17,}}>{rowData.Name}</Text>
           </View>
         </View>
         <View style={{flexDirection:'row',justifyContent: 'flex-start', marginLeft:15,marginRight:15,paddingBottom:15}}>
            <Text style={{width:SCREEN_WIDTH-50,}}>
               {this._renderDetail(rowData.OtherInfo)}
            </Text>
         </View>
       </View>

       <View style={{marginRight:8}}>
         <Image source={require('../../images/arr_right_icon.png')} style={{width:15,height:15}}/>
       </View>
     </TouchableOpacity>

    );
  }
  render() {
    return (
      <View style={{height:SCREEN_HEIGHT-115,backgroundColor:'#efeff4'}}>
        {this.props.fetching?<View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                  <ActivityIndicator />
                  <Text>正在努力加载</Text>
              </View>:<View></View>}
        <ListView
               style={{width:SCREEN_WIDTH}}
               dataSource={this.ds.cloneWithRows(this.props.result.slice(0))}
               renderRow={this._renderRow}
               enableEmptySections={true}
               />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  layout:{
    flex:1
  }
});


export default ResultCompontent;
