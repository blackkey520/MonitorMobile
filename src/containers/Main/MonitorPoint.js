

import React, { PureComponent } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import HistoryData from '../../components/Point/HistoryData';
import LoadingComponent from '../../components/Common/LoadingComponent';
import CustomTabBar from '../../components/Common/CustomTabBar';
import pointMenu from '../../config/pointMenu.json';
import PointDetail from '../../components/Point/PointDetail';

@connect(({ point }) => ({ loading: point.loading, selectedpoint: point.selectedpoint }))
class MonitorPoint extends PureComponent {
    static navigationOptions = ({ navigation, screenProps }) => ({
      headerTitle: '监控点位',
      headerBackTitle: null,
      headerTintColor: '#fff',
      headerStyle: { backgroundColor: '#4f6aea' }
    });
    render() {
      const tabnames = [];
      pointMenu.map((item, key) => {
        tabnames.push(item.pointMenuName);
      });
      return (
        <View style={styles.layout}>
          {
            this.props.loading || this.props.selectedpoint === null ?
              <LoadingComponent Message="正在加载数据" />
              :
              <ScrollableTabView
                tabBarBackgroundColor={'#fff'}
                tabBarUnderlineStyle={{ backgroundColor: '#108ee9', height: 1 }}
                renderTabBar={() => <CustomTabBar tabNames={tabnames} />}
                removeClippedSubviews={false}
                initialPage={0}
                prerenderingSiblingsNumber={1}
              >
                {
                  pointMenu.map((item, key) => {
                    if (key === 0) {
                      return (<PointDetail
                        key={item.pointMenuID}
                        tabLabel={item.pointMenuName}
                      />);
                    } else if (key === 1) {
                      return (<HistoryData
                        navdgimn={this.props.navigation.state.params.dgimn}
                        key={item.pointMenuID}
                        tabLabel={item.pointMenuName}
                      />);
                    }
                  })
                }
              </ScrollableTabView>
          }
        </View>
      );
    }
}


const styles = StyleSheet.create({
  layout: {
    flex: 1
  }
});


export default MonitorPoint;
