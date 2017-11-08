

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { Badge } from 'antd-mobile';

class CustomTabBar extends Component {
  static propTypes = {
    goToPage: React.PropTypes.func, // 跳转到对应tab的方法
    activeTab: React.PropTypes.number, // 当前被选中的tab下标
  }; // 注意这里有分号

  // 组件渲染完毕方法
  componentDidMount() {
    // Animated.Value监听范围 [0, tab数量-1]
    this.props.scrollValue.addListener(this.setAnimationValue);
  }
  // 设置动画数值回调函数
  setAnimationValue({ value }) {

  }
  // 渲染Tab项方法
  renderTabOption(tab, i) {
    const color = this.props.activeTab === i ? '#4c82f7' : '#443f3f'; // 判断i是否是当前选中的tab，设置不同的颜色
    return (
      <TouchableOpacity
        onPress={() => this.props.goToPage(i)}
        style={[styles.tab,
          { borderBottomColor: color, borderBottomWidth: this.props.activeTab === i ? 1 : 0 }]}
        key={tab}
      >
        <View style={styles.tabItem}>
          <Text style={{ fontSize: 14, color }}>
            {this.props.tabNames[i]}
          </Text>
          {this.props.tabBadge && this.props.tabBadge[i] && this.props.tabBadge[i] !== 0 ?
            <Badge
              style={{ marginTop: -10, marginLeft: 15 }}
              text={this.props.tabBadge[i]}
              overflowCount={99}
            /> : null}
        </View>
      </TouchableOpacity>
    );
  }
  // 组件渲染方法
  render() {
    return (
      <View style={styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#fff'
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
export default CustomTabBar;
