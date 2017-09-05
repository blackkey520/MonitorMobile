'use strict';

import React, { Component,PureComponent} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ListView
} from 'react-native';
import { connect } from 'dva'
import { NavigationActions } from '../../utils'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import UnVerifiedList from '../../components/Alarm/UnVerifiedList'
import VerifiedHistory from '../../components/Alarm/VerifiedHistory'
import { Badge } from 'antd-mobile';
import pinyin from 'pinyin';
import py from '../../components/Common/alphabetaList/py';
import heightMsg from '../../components/Common/alphabetaList/heightMsg';
import Head from '../../components/Common/alphabetaList/head';
import MainList from '../../components/Common/alphabetaList/mainList';
import AlphabetaList from '../../components/Common/alphabetaList/alphabetaList';
import LoadingComponent from '../../components/Common/LoadingComponent'
import NoDataComponent from '../../components/Common/NoDataComponent'
@connect(({ app }) => ({fetching:app.fetching,contactlist:app.contactlist }))
class ContactList extends PureComponent {
  static navigationOptions = {
    title: '通讯录',
    headerTintColor:'#fff',
    headerStyle:{backgroundColor:'#4f6aea'},
  }
  ds = new ListView.DataSource({ rowHasChanged: (v1, v2) => v1 !== v2 });
  constructor(props) {
      super(props);

      this.state = {
          dataSource: this.ds.cloneWithRows([]),
          headHeight: 0,
          functionHeight: 0
      }
  }
  // componentDidMount(){
  //
  //
  //
  //     this.setState({
  //       dataSource:this.ds.cloneWithRows(data)
  //     });
  // }
  JsonSort=(array, key)=>{
    return array.sort(function(a, b) {
      if(a&&b&&a[key]&&b[key])
      {
        let x = pinyin(a[key].toLowerCase());
        let y = pinyin(b[key].toLowerCase());
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      }
    });
  }
  _changeHeadHeight=(h)=>{
      this.setState({
          headHeight: h
      })
  };

  changeFunctionHeight=(h)=> {
      this.setState({
          functionHeight: h
      })
  };

  getScroll=()=> {
      return this.refs.myScroll;
  };
  render() {

    let temp = this.JsonSort(this.props.contactlist, 'User_Name');
    let data = py(temp);
    return (
      <View style={styles.layout}>
        {
          this.props.fetching?<LoadingComponent Message={'正在加载数据'}/>:this.props.contactlist.length==0
          ?<NoDataComponent Message={'没有数据'}/>:<View style={{flex:1}}>
            <Head headHeight={46} changeHeadHeight={(e)=>this._changeHeadHeight(e)} />
           <ScrollView bounces={false} ref="myScroll">
                       <MainList dataSource={this.ds.cloneWithRows(data)} />
                   </ScrollView>
                   <AlphabetaList scroll={()=>this.getScroll()} headHeight={this.state.headHeight}
                               functionHeight={this.state.functionHeight}/>
          </View>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({

    layout:{
      flex:1
    }
});
export default ContactList;
