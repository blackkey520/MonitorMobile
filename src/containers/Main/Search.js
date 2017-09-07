'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { connect } from 'dva'
import { loadStorage} from '../../logics/rpc';
import { createAction,NavigationActions } from '../../utils'
import { SearchBar, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import Icon from 'react-native-vector-icons/Ionicons';
import AssociateComponent from '../../components/Search/AssociateComponent';
import HistoryComponent from '../../components/Search/HistoryComponent';
import ResultComponent from '../../components/Search/ResultComponent';

@connect(({ search }) => ({ searchscene:search.searchscene }))
class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText:''
    };
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: '搜索',
    headerTintColor:'#fff',
    headerStyle:{backgroundColor:'#4f6aea'},
    headerRight: (
        <TouchableOpacity onPress ={()=>{
          const dismissKeyboard = require('dismissKeyboard');
          dismissKeyboard();
          // NOTE: 二维码扫描
          navigation.dispatch(NavigationActions.navigate({ routeName: 'QRCodeScreen' }))
        }} style={{marginRight:10}}>
            <Icon name="ios-barcode-outline" size={30} color="#fff" />
        </TouchableOpacity>
    ),
    headerLeft:(
      <TouchableOpacity onPress ={()=>{
        navigation.dispatch(NavigationActions.back())
        navigation.dispatch(createAction('search/changeScene')({
          Scene:'history'
        }));
      }} style={{marginLeft:10}}>
          <Icon name="ios-arrow-back" size={30}  color="#fff" />
      </TouchableOpacity>
    )
  });
  _handleUpdateChange=(text)=>{
    this.setState({
      'searchText':text
    });
    setTimeout(function() {

          if (text != this.state.searchText) {
              return;
          } else {
              if (text) {
                // this.props.dispatch(createAction('search/changeScene')({
                //   Scene:'associate'
                // }));
                this.props.dispatch(createAction('search/associate')({
                  searchText:text
                }));
              }
          }
        }.bind(this), 300);
  }
  render() {
    return (
      <View style={styles.layout}>
        <View>
          <SearchBar placeholder="输入查询条件搜索" value={this.state.searchText} onCancel={()=>{

            this.props.dispatch(createAction('search/changeScene')({
              Scene:'history'
            }));
            this.props.dispatch(NavigationActions.back())
          }} onChange={(text)=>{
            this._handleUpdateChange(text)
          }} onSubmit={async(text)=>{
            // this.props.dispatch(createAction('search/changeScene')({
            //   Scene:'result'
            // }));
            this.props.dispatch(createAction('search/search')({
              current:1,
              searchText:text
            }));
          }} showCancelButton={false} autoFocus />
          {this.props.searchscene=='history'?<HistoryComponent  {...this.props} />:
          this.props.searchscene=='associate'?<AssociateComponent  {...this.props}/>:
          this.props.searchscene=='result'?<ResultComponent  {...this.props} />:<View></View>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  layout:{
    flex:1
  }
});


export default Search;
