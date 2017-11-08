

import React, { PureComponent } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import WarnList from '../../components/Alarm/WarnList';
import VerifiedList from '../../components/Alarm/VerifiedList';
import CustomTabBar from '../../components/Common/CustomTabBar';

@connect(({ alarm }) => ({ unverifiedCount: alarm.unverifiedCount }))
class Alarm extends PureComponent {
  static navigationOptions = {
    title: '报警核实',
    headerTintColor: '#fff',
    headerBackTitle: null,
    headerStyle: { backgroundColor: '#4f6aea' },
  }
  render() {
    return (
      <View style={styles.layout}>
        <ScrollableTabView
          // 指定单个选项卡的渲染组件
          renderTabBar={() => <CustomTabBar tabBadge={[this.props.unverifiedCount]} tabNames={['待核实', '核实记录']} />}
          initialPage={0}
          prerenderingSiblingsNumber={1}
        >
          <WarnList tabLabel="待核实" />
          <VerifiedList tabLabel="核实记录" />
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  layout: {
    flex: 1
  }
});
export default Alarm;
