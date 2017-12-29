

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import MonitorView from '../../components/Point/MonitorView';
import LoadingComponent from '../../components/Common/LoadingComponent';
import PointDetail from '../../components/Point/PointDetail';
import { createAction } from '../../utils';

@connect(({ point }) => ({ loading: point.loading, selectedpoint: point.selectedpoint }))
class MonitorPoint extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
      headerTitle: '监控点位',
      headerBackTitle: null,
      headerTintColor: '#fff',
      headerStyle: { backgroundColor: '#4f6aea' },
    });
  // this.props.dispatch(createAction('monitordata/searchdata')({
  //                       dgimn: this.props.navigation.state.params.dgimn,
  //                       startDate: moment().add(-10, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
  //                       endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
  //                       pollutant: this.props.selectedpoint.PollutantTypeInfo[0],
  //                       dataType: 'realtime',
  //                     }));
  // <HistoryData
  //                   navdgimn={this.props.navigation.state.params.dgimn}
  //                 />
    render() {
      return (
        <View style={styles.layout}>
          {
            this.props.loading || this.props.selectedpoint === null ?
              <LoadingComponent Message="正在加载数据" />
              :
              <ScrollView>
                <PointDetail />
                <View style={{ height: 5 }} />
                <MonitorView />
              </ScrollView>
          }
        </View>
      );
    }
}


const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});


export default MonitorPoint;
