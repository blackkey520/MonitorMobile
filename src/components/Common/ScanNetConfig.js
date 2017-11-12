// import liraries
import React, { Component } from 'react';
import { View } from 'react-native';
import { Toast } from 'antd-mobile';
import { QRScannerView } from 'ac-qrcode';
import { saveNetConfig } from '../../dvapack/storage';
// create a component
class ScanNetConfig extends Component {
  constructor(props) {
    super(props);
    this.barCodeFlag = true;
    this.state = {
      isAutoLoad: false
    };
  }


  barcodeReceived=(e) => {
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
        setTimeout(() => {
          this.barCodeFlag = true;
        }, 8000);
      });
    }
  }
  renderMenu() {
    return (
      <View />
    );
  }
  renderTitleBar() {
    return (
      <View />
    );
  }
  render() {
    return (
      <QRScannerView
        onScanResultReceived={this.barcodeReceived}
        hintText={'请扫描平台中的授权码'}
        hintTextPosition={170}
        borderWidth={0}
        iscorneroffset={false}
        cornerOffsetSize={0}
        scanBarAnimateTime={3000}
        renderTopBarView={() => (<View style={{ flex: 1 }} />)}
        renderBottomMenuView={() => this.renderMenu()}
      />

    );
  }
}
export default ScanNetConfig;
