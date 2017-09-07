'use strict';

import React, { Component,PureComponent} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ListView
} from 'react-native';
import { connect } from 'dva'
import { createAction, NavigationActions } from '../../utils'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
@connect(({ search }) => ({ associateresult:search.associateresult }))
class AssociateCompontent extends PureComponent {
  ds = new ListView.DataSource({ rowHasChanged: (v1, v2) => v1 !== v2 });
  _renderRow=(rowData, sectionID, rowID, highlightRow)=>{
    return(
     //  需要二级查询的ListView行组件渲染
      <TouchableOpacity onPress={()=>{
        let otherArray=rowData.OtherInfo.split('&#&');
        if(rowData.Type==1||rowData.Type==2||rowData.Type==3||rowData.Type==4)
        {
          this.props.dispatch(createAction('target/selecttarget')({
            targetCode:rowData.Code,
            baseType:rowData.Type
          })); 
        }else{
          this.props.dispatch(createAction('point/selectpoint')({
            dgimn:otherArray[0]
          }));
        }

      }} style={styles.LayoutStyle}>
          <Image source={require('../../images/search_icon.png')} style={{
              width: 20,
              height: 20
          }}/>
          <View style={styles.SecondLayoutStyle}>
            <View style={styles.pointLayoutStyle}>
               <Text>{rowData.Name}</Text>
            </View>
          </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={{height:SCREEN_HEIGHT,backgroundColor:'#efeff4'}}>
        <Text style={{fontSize:12,color:'#bcbcbe',marginLeft:10}}>{'猜你想搜'}</Text>
        <ListView
          renderRow={this._renderRow}
          dataSource={this.ds.cloneWithRows(this.props.associateresult.slice(0))}
        enableEmptySections={true}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  LayoutStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

    },
    pointLayoutStyle: {
        width: SCREEN_WIDTH - 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    SecondLayoutStyle: {
      height: 50,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderBottomColor: '#dddddd',
      borderBottomWidth:1
  },
    enterpriseLayoutStyle: {
        width: SCREEN_WIDTH - 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
});



export default AssociateCompontent;
