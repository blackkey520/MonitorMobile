

import React, { PureComponent } from 'react';

import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Toast } from 'antd-mobile';
import { QRScannerView } from 'ac-qrcode';
import { NavigationActions } from '../../utils';

 @connect()
export default class QRCodeScreen extends PureComponent {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: '二维码',
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: '#4f6aea' }
  });
  constructor(props) {
    super(props);
    this.barCodeFlag = true;
    this.state = {};
  }
    barcodeReceived=(e) => {
      if (this.barCodeFlag) {
        this.barCodeFlag = false;
        Toast.loading('扫描中...', 2, () => {
          this.props.dispatch(NavigationActions.navigate({
            routeName: 'MonitorPoint',
            params: {
              dgimn: e.data
            }, }));
          setTimeout(() => {
            this.barCodeFlag = true;
          }, 8000);
        });
      }
    }
    renderTitleBar() {
      return (
        <View />
      );
    }
    renderMenu() {
      return (
        <View />
      );
    }
    render() {
      return (
        <QRScannerView
          onScanResultReceived={this.barcodeReceived}
          renderTopBarView={() => this.renderTitleBar()}
          renderBottomMenuView={() => this.renderMenu()}
        />
      );
    }
}
