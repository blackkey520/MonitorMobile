

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

const SCREEN_WIDTH = Dimensions.get('window').width;
@connect(({ feedback }) => ({ loading: feedback.loading,
  alarmdetail: feedback.alarmdetail }))
class FeedbackAlarmDetail extends PureComponent {
  extraUniqueKey=(item, index) => `index${index}${item}`
  renderItem=({ item }) => (
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
          <Text style={{ marginLeft: 5, fontSize: 15, color: '#37353a' }}>{item.ExceptionType}</Text>
        </View>
        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
          <Image source={require('../../images/alarm_long.png')} style={{ width: 15, height: 15 }} />
          <Text style={{ marginLeft: 5, fontSize: 13, color: '#a4a4a4' }}>{item.AlarmTime}</Text>
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
  )
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
        <FlatList
          ListEmptyComponent={() => (this.props.loading ? null : <NoDataComponent Message={'没有查询到数据'} />)}
          keyExtractor={this.extraUniqueKey}
          data={this.props.alarmdetail}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}


export default FeedbackAlarmDetail;
