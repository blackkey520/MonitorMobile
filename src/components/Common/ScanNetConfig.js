// import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Toast } from 'antd-mobile';
import { QRScannerView } from 'ac-qrcode';
import { saveNetConfig } from '../../logics/rpc';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
// create a component
class ScanNetConfig extends Component {
  constructor(props) {
    super(props);
    this.barCodeFlag = true;
    this.state = {
      isAutoLoad: false
    };
  }
  render() {
    return (
      <QRScannerView
        onScanResultReceived={this._barcodeReceived}
        hintText={'请扫描平台中的授权码'}
        hintTextPosition={170}
        borderWidth={0}
        iscorneroffset={false}
        cornerOffsetSize={0}
        scanBarAnimateTime={3000}
        renderTopBarView={() => (<View style={{ flex: 1 }} />)}
        renderBottomMenuView={() => this._renderMenu()}
      />

    );
  }
  _renderTitleBar() {
    return (
      <View />
    );
  }
  _renderMenu() {
    return (
      <View />
    );
  }

  _barcodeReceived=(e) => {
    if (this.barCodeFlag) {
      this.barCodeFlag = false;
      const config = e.data.split('§');
      newconfig = [];
      config.map((item, key) => {
        const netitem = {};
        netitem.neturl = `http://${item}`;
        if (key === 0) {
          netitem.isuse = true;
        } else {
          netitem.isuse = false;
        }
        newconfig.push(netitem);
      });
      saveNetConfig(newconfig);
      Toast.loading('扫描中...', 2, () => {
        this.props.ScanSuccess();
        setTimeout(function() {
            this.barCodeFlag = true;
          }.bind(this),8000);
      });
    }
  }
}
export default ScanNetConfig;
