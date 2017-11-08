

import React, { PureComponent } from 'react';

import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import NoDataComponent from '../../components/Common/NoDataComponent';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
@connect(({ alarm }) => ({ alarmlist: alarm.alarmlist }))
class FeedbackAlarmList extends PureComponent {
  extraUniqueKey=(item, index) => `index${index}${item}`
  renderItem=({ item }) => {
    if (this.props.selected.get(item.ID)) {
      return (
        <TouchableOpacity
          style={{ width: SCREEN_WIDTH - 20,
            borderRadius: 10,
            marginLeft: 10,
            backgroundColor: '#fff',
            marginTop: 5 }}
          onPress={() => {
          }}
        >
          <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
            <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
              <Text style={{ marginLeft: 5, fontSize: 15, color: '#37353a' }}>{item.AlarmType === 2 ? '超标报警' : '异常报警'}</Text>
            </View>
            <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
              <Image source={require('../../images/alarm_long.png')} style={{ width: 15, height: 15 }} />
              <Text style={{ marginLeft: 5, fontSize: 13, color: '#a4a4a4' }}>{`${item.FirstTime.substring(10, item.FirstTime.length)
              }-${item.AlarmTime.substring(10, item.AlarmTime.length)}`}</Text>
            </View>
          </View>
          <View style={{ marginTop: 10,
            marginBottom: 10,
            flex: 1,
            marginLeft: 30,
            width: SCREEN_WIDTH - 70 }}
          >
            <Text style={{ fontSize: 12, color: '#a0a0a2' }}>{item.AlarmMsg}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (<View />);
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
        <FlatList
          ListEmptyComponent={() => (this.props.alarmlistfetching ? null : <View style={{ height: SCREEN_HEIGHT - 200 }}><NoDataComponent Message={'没有查询到数据'} /></View>)}
          keyExtractor={this.extraUniqueKey}
          data={this.props.alarmlist}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}


export default FeedbackAlarmList;
