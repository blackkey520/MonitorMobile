

import React, { PureComponent } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ListView,
  Dimensions,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from '../../utils';
import LoadingComponent from '../../components/Common/LoadingComponent';
import NoDataComponent from '../../components/Common/NoDataComponent';

const SCREEN_WIDTH = Dimensions.get('window').width;
@connect(({ point }) => ({ loading: point.loading, collectpointlist: point.collectpointlist }))
class CollectPointList extends PureComponent {
  static navigationOptions = {
    title: '我的收藏',
    headerTintColor: '#fff',
    headerBackTitle: null,
    headerStyle: { backgroundColor: '#4f6aea' },
  }

  constructor(props) {
    super(props);
    this.dataSource = [];
  }
  ds = new ListView.DataSource({ rowHasChanged: (v1, v2) => v1 !== v2 });

  //  单行渲染方法
  renderRow = (rowData, sectionID, rowID, highlightRow) => {
    const img = rowData.status === 0 ?
      require('../../images/offline.png') : rowData.status === 1 ?
        require('../../images/online.png') : rowData.status === 2 ?
          require('../../images/over.png') :
          require('../../images/exception.png');
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.dispatch(NavigationActions.navigate({
            routeName: 'MonitorPoint',
            params: {
              dgimn: rowData.dgimn
            }, }));
        }}
        style={{ width: SCREEN_WIDTH - 16,
          backgroundColor: 'white',
          marginTop: 5,
          marginLeft: 8,
          borderRadius: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between', }}
      >
        <View style={{ width: SCREEN_WIDTH - 70,
          height: 75,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start' }}
        >
          <View style={{ marginLeft: 15 }}>
            <Text style={{ fontSize: 17, color: '#443f3f' }}>
              {rowData.entName}
            </Text>
            <Text style={{ marginTop: 5, fontSize: 13, color: '#959494' }}>
              {rowData.pointName}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'column', height: 70, marginRight: 10, alignItems: 'center', justifyContent: 'space-around', }}>
          <Image
            source={img}
            style={{
              width: 40,
              height: 40
            }}
          />
          <View style={{ flexDirection: 'row', }}>
            <Text style={{ fontSize: 13, color: '#959494' }}>{'详情'}</Text>
            <Image source={require('../../images/arr_right_icon.png')} style={{ width: 13, height: 13 }} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.loading ?
          <LoadingComponent Message="正在加载数据" />
          : this.props.collectpointlist.length !== 0 ?
            <ListView
              style={{ width: SCREEN_WIDTH }}
              dataSource={this.ds.cloneWithRows(this.props.collectpointlist
                ? this.props.collectpointlist : [])}
              renderRow={this.renderRow}
              enableEmptySections
            /> :
            <NoDataComponent Message="您还没有收藏监测点" />}
      </View>
    );
  }
}

export default CollectPointList;
