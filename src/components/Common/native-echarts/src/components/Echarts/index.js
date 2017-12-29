import React, { Component } from 'react';
import { WebView, View, StyleSheet, Platform } from 'react-native';
import renderChart from './renderChart';
import echarts from './echarts.min';

export default class App extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.option !== this.props.option) {
      // 解决数据改变时页面闪烁的问题
      this.refs.chart.injectJavaScript(renderChart(nextProps));
    }
  }
  // 预防过渡渲染
  shouldComponentUpdate(nextProps, nextState) {
    const thisProps = this.props || {};
    nextProps = nextProps || {};
    if (Object.keys(thisProps).length !== Object.keys(nextProps).length) {
      return true;
    }
    for (const key in nextProps) {
      if (JSON.stringify(thisProps[key]) != JSON.stringify(nextProps[key])) {
      // console.log('props', key, thisProps[key], nextProps[key])
        return true;
      }
    }
    return false;
  }

  render() {
    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#fff', flex: 1, height: this.props.height || 400 }} >
        <WebView
          ref="chart"
          scrollEnabled={false}
          scalesPageToFit={Platform.OS !== 'ios'}
          // automaticallyAdjustContentInsets={true}
          injectedJavaScript={renderChart(this.props)}
          style={{
            height: this.props.height || 400,
            backgroundColor: 'rgba(0,0,0,0)',
          }}
          //source={require('./tpl.html')}
          source={{ uri: 'file:///android_asset/tpl.html' }}
        />
      </View>
    );
  }
}
