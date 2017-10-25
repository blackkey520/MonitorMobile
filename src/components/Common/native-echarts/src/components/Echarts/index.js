import React, { Component } from 'react';
import { WebView, View, StyleSheet, Platform } from 'react-native';
import renderChart from './renderChart';
import echarts from './echarts.min';

export default class App extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.option !== this.props.option) {
      this.refs.chart.reload();
    }
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
          }}
          source={require('./tpl.html')}
        />
      </View>
    );
  }
}
