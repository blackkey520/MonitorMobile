

import React, { PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { MapView, Marker } from 'react-native-amap3d';
import { createAction, NavigationActions, FindMapImg } from '../../utils';

const SCREEN_WIDTH = Dimensions.get('window').width;


@connect(({ point, monitordata }) => ({ pointlist: point.pointlist,
  lastmonitorpoint: monitordata.lastmonitorpoint,
  lastmonitordata: monitordata.lastmonitordata,
  spinning: monitordata.spinning }))
class MapCompontent extends PureComponent {
  renderLastData=(dgimn) => {
    let rtnVal;
    if (this.props.lastmonitorpoint != null && this.props.lastmonitorpoint.DGIMN === dgimn) {
      if (this.props.spinning) {
        rtnVal = <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}><Text style={{ fontSize: 15, color: '#747270' }}>{'正在加载中'}</Text></View>;
      } else if (this.props.lastmonitordata.length === 0) {
        rtnVal = <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}><Text style={{ fontSize: 15, color: '#747270' }}>{'没有查询到数据'}</Text></View>;
      } else {
        rtnVal = [];
        this.props.lastmonitordata.map((item, key) => {
          let color = '#747270';
          if (item.StandardColor !== '') {
            color = item.StandardColor;
          }
          if (key < 6) {
            rtnVal.push(
              <View
                key={item.PollutantCode}
                style={{ flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginTop: 5,
                  width: (SCREEN_WIDTH / 2) / 3,
                  height: 45 }}
              >
                <Text style={{ fontSize: 14, color }}>
                  {item.Value}
                </Text>
                <Text style={{ fontSize: 11, color: '#adadad' }}>
                  {item.PollutantName}
                </Text>
              </View>
            );
          }
        });
      }
    } else {
      rtnVal = <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}><Text style={{ fontSize: 15, color: '#747270' }}>{'正在加载中'}</Text></View>;
    }
    return rtnVal;
  }
  renderDate=() => (
    <Text style={{ marginLeft: 10, fontSize: 12, color: '#fff' }}>
      {`监测时间:${this.props.lastmonitordata[0].Time}`}
    </Text>
  );
  renderPoint = () => {
    const rtnVal = [];
    if (this.props.pointlist) {
      this.props.pointlist.map((item, key) => {
        const img = FindMapImg(item.imgName);
        rtnVal.push(<Marker
          key={item.dgimn}
          onPress={() => {
            this.props.dispatch(createAction('monitordata/searchlastdata')({ dgimn: item.dgimn }));
          }}
          icon={() =>
            (<View style={{ width: 20, height: 20 }}>
              <Image style={{ width: 20, height: 20 }} source={img} />
            </View>)
          }
          coordinate={{
            latitude: item.latitude,
            longitude: item.longitude,
          }}
        >
          <View style={{ alignItems: 'center',
            height: SCREEN_WIDTH / 2 + 60,
            borderColor: '#c3cdbf',
            borderRadius: 7,
            borderWidth: 1,
            flexDirection: 'column',
            width: SCREEN_WIDTH / 2 + 20,
            backgroundColor: 'white' }}
          >
            <View style={{ justifyContent: 'space-around',
              height: 90,
              width: SCREEN_WIDTH / 2 + 20,
              backgroundColor: '#6395ff',
              borderBottomWidth: 2,
              borderBottomColor: '#356fe8' }}
            >
              <Text style={{ marginLeft: 10, fontSize: 15, color: '#fff' }}>
                {item.targetName}
              </Text>
              <Text style={{ marginLeft: 10, fontSize: 13, color: '#fff' }}>
                {item.pointName}
              </Text>
              {
                this.props.lastmonitorpoint != null && this.props.lastmonitordata.length !== 0
                && this.props.lastmonitorpoint.DGIMN
                 === item.dgimn ? this.renderDate() : null
              }
            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', width: SCREEN_WIDTH / 2 + 10 }}>
              {this.renderLastData(item.dgimn)}
            </View>

            <TouchableOpacity
              onPress={() => {
                this.props.dispatch(NavigationActions.navigate({
                  routeName: 'MonitorPoint',
                  params: {
                    dgimn: item.dgimn
                  }, }));
              }}
              style={{ justifyContent: 'center',
                height: 25,
                marginBottom: 5,
                backgroundColor: '#6996ff',
                borderRadius: 7,
                alignItems: 'center',
                width: SCREEN_WIDTH / 2 - 10 }}
            >
              <Text style={{ color: '#fff', fontSize: 13 }}>
                {'查看详情'}
              </Text>
            </TouchableOpacity>

          </View>
        </Marker>);
      });
    }
    return rtnVal;
  }

  render() {
    return (
      <View style={{
        flex: 1
      }}
      >
        <MapView
          ref={ref => { this.mapView = ref; }}
          rotateEnabled
          tiltEnabled
          style={StyleSheet.absoluteFill}
        >
          {this.renderPoint()}
        </MapView>

      </View>
    );
  }
}


export default MapCompontent;
