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
import LoadingComponent from '../Common/LoadingComponent'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
import dateFormat from 'dateformat'

@connect(({ point }) => ({ fetching:point.fetching,result:point.result }))
class ListCompontent extends PureComponent {
  ds = new ListView.DataSource({ rowHasChanged: (v1, v2) => v1 !== v2 });
  constructor(props) {
    super(props);
    this.dataSource = [];
  }

  componentWillMount() {
    // this.props.dispatch(createAction('point/fetchmore')({
    //     pollutantType:this.props.PollutantType
    // }));
  }
  //  单行渲染方法
  _renderRow = (rowData, sectionID, rowID, highlightRow)=>{
    const img=rowData.status==0?
    require('../../images/offline.png'):rowData.status==1?
    require('../../images/online.png'):rowData.status==2?
    require('../../images/over.png'):
    require('../../images/exception.png')
    return (
      <TouchableOpacity onPress={()=>{
        this.props.dispatch(createAction('point/selectpoint')({
          dgimn:rowData.dgimn
        }));

        this.props.dispatch(NavigationActions.navigate({
          routeName: 'MonitorPoint',params:{dgimn:rowData.dgimn}
        }));
      }} style={{width:SCREEN_WIDTH-16,backgroundColor:'white',marginTop:5,
        marginLeft:8,borderRadius:5,flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',}}>
        <View style={{width:SCREEN_WIDTH-70,height:75,flexDirection:'row',
          alignItems: 'center',justifyContent: 'flex-start'}}>
          <View style={{marginLeft:15}}>
            <Text style={{fontSize:17,color:'#443f3f'}}>
              {rowData.targetName}
            </Text>
            <Text style={{marginTop:5,fontSize:13,color:'#959494'}}>
              {rowData.pointName}
            </Text>
          </View>
        </View>
        <View style={{flexDirection:'column',height:70,marginRight:10,alignItems: 'center',justifyContent: 'space-around',}}>
          <Image source={img} style={{
            width: 40,
            height: 40
          }}/>
          <View style={{flexDirection:'row',}}>
            <Text style={{fontSize:13,color:'#959494'}}>{'详情'}</Text>
            <Image source={require('../../images/arr_right_icon.png')} style={{width:13,height:13}}/>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={{height:SCREEN_HEIGHT-115}}>
        {this.props.fetching?
          <LoadingComponent Message='正在加载数据'/>
          :  <ListView
                   style={{width:SCREEN_WIDTH}}
                   dataSource={this.ds.cloneWithRows(this.props.result?this.props.result:[])}
                   renderRow={this._renderRow}
                   enableEmptySections={true}
                   />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  layout:{
    flex:1
  }
});


export default ListCompontent;
