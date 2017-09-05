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
import { loadStorage,saveStorage} from '../../logics/rpc';

import { connect } from 'dva'
import { createAction, NavigationActions } from '../../utils'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
@connect(({ search }) => ({ searchhistory:search.searchhistory}))
class HistoryCompontent extends PureComponent {
  ds = new ListView.DataSource({ rowHasChanged: (v1, v2) => v1 !== v2 });
  // constructor(props) {
  //   super(props);
  //       this.state = {
  //           historyList:[],
  //       };
  // }
  async componentWillMount() {

    this.props.dispatch(createAction('search/loadsearchhistory')({
      Num:10,
    }));
  }
  //  单行渲染方法
  _renderRow = (rowData, sectionID, rowID, highlightRow)=>{

     return(
      //  需要二级查询的ListView行组件渲染
       <TouchableOpacity onPress={()=>{
         this.props.dispatch(createAction('search/changeScene')({
           Scene:'result'
         }));
         this.props.dispatch(createAction('search/search')({
           current:1,
           searchText:rowData.SearchContent
         }));
       }} style={styles.LayoutStyle}>
           <Image source={require('../../images/search_icon.png')} style={{
               width: 20,
               height: 20
           }}/>
           <View style={styles.SecondLayoutStyle}>
             <View style={styles.pointLayoutStyle}>
                <Text>{rowData.SearchContent}</Text>
             </View>
           </View>
       </TouchableOpacity>
     );
  }
  render() {
    return (
      <View style={{height:SCREEN_HEIGHT-115,flexDirection:'column',alignItems: 'flex-start',backgroundColor:'#efeff4'}}>
        <Text style={{fontSize:12,color:'#bcbcbe',marginLeft:10}}>{'搜索历史'}</Text>
        <ListView
               style={{width:SCREEN_WIDTH}}
               dataSource={this.ds.cloneWithRows(this.props.searchhistory?this.props.searchhistory:[])}
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
  },
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
export default HistoryCompontent;
