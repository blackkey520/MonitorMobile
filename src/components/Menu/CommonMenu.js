'use strict';

import React, { PropTypes,Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions
} from 'react-native';
import CommonMenuJson from '../../config/CommonMenu.json';
import Icon from 'react-native-vector-icons/Ionicons';
import {Grid} from 'antd-mobile';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
class CommonMenu extends PureComponent {
  static contextTypes = {
    navigator: PropTypes.object,
  };
  render() {
    return (
      <View>
          <View style={{flexDirection:'row',height:40,justifyContent: 'space-between',alignItems: 'center',marginLeft:10}}>
            <Text style={{fontSize:15}}>常用功能</Text><Text style={{fontSize:12,marginRight:10}}>更多</Text></View>
            <View style={{backgroundColor:'white'}}>
              <Grid data={CommonMenuJson} columnNum={4} hasLine={true}
                onClick={(_el, index) => {

                }}
                renderItem={(dataItem, index) => (
                  <View style={styles.MenuItem}>
                    <Icon
                        name={dataItem.MenuIco} // 图标
                        size={25}
                        color="gray"
                      />
                    <View>
                      <Text style={{marginTop:5,fontSize:13}}>
                        {dataItem.MenuName}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MenuItem:{
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
    height:80,
    width:SCREEN_WIDTH/4,
    // borderColor:'red',
    // borderWidth:1
  }
});


export default CommonMenu;
