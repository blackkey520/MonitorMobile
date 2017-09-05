'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'dva'
import { createAction,NavigationActions } from '../../utils'
import Icon from 'react-native-vector-icons/Ionicons';
import { Toast } from 'antd-mobile';
import { QRScannerView } from 'ac-qrcode';
 @connect()
export default class QRCodeScreen extends PureComponent {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: '二维码',
    headerTintColor:'#fff',
    headerStyle:{backgroundColor:'#4f6aea'}
  });
  constructor(props) {
    super(props);
    this.barCodeFlag = true;
    this.state = {};
  }
    render() {
        return (
            <QRScannerView
                onScanResultReceived={this._barcodeReceived}
                renderTopBarView={() => this._renderTitleBar()}
                renderBottomMenuView={() => this._renderMenu()}
            />
        )
    }
    _renderTitleBar(){
        return(
            <View
            ></View>
        );
    }
    _renderMenu() {
        return (
            <View
            ></View>
        )
    }
    _barcodeReceived=(e)=> {
      if (this.barCodeFlag) {
        this.barCodeFlag = false;
        Toast.loading('扫描中...', 2, () => {
          this.props.dispatch(createAction('point/selectpoint')({
            dgimn:e.data
          }));
          this.props.dispatch(NavigationActions.navigate({
            routeName: 'MonitorPoint',params:{dgimn:e.data,title:''}
          }));
          setTimeout(function() {
            this.barCodeFlag = true;
          }.bind(this),8000);
        });
      }

    }
}
