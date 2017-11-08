

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
import { MapView, Marker, Polygon } from 'react-native-amap3d';

import { createAction, GetPointsCenter, FindMapImg, NavigationActions } from '../../utils';

const SCREEN_WIDTH = Dimensions.get('window').width;


@connect(({ target, monitordata }) => ({ lastmonitorpoint: monitordata.lastmonitorpoint,
  targetBase: target.targetBase,
  spinning: monitordata.spinning,
  lastmonitordata: monitordata.lastmonitordata }))
class TargetMapComponent extends PureComponent {
  renderPoint=() => {
    const rtnVal = [];
    if (this.props.targetBase.OtherInfo) {
      this.props.targetBase.OtherInfo.map((item, key) => {
        const img = FindMapImg(item.imgName);
        return rtnVal.push(<Marker
          key={item.Dgimn}
          onPress={() => {
            this.props.dispatch(createAction('monitordata/searchlastdata')({ dgimn: item.Dgimn }));
          }}

          icon={() =>
            (<View style={{ width: 20, height: 20 }}>
              <Image style={{ width: 20, height: 20 }} source={img} />
            </View>)
          }
          coordinate={{
            latitude: item.Latitude,
            longitude: item.Longitude,
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
                {this.props.targetBase.TargetInfo.TargetName}
              </Text>
              <Text style={{ marginLeft: 10, fontSize: 13, color: '#fff' }}>
                {item.PointName}
              </Text>
              {
                this.props.lastmonitorpoint != null && this.props.lastmonitordata.length !== 0 &&
                this.props.lastmonitorpoint.DGIMN === item.Dgimn
                  ? this.renderDate() : null
              }
            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', width: SCREEN_WIDTH / 2 + 10 }}>
              {this.renderLastData(item)}
            </View>

            <TouchableOpacity
              onPress={() => {
                this.props.dispatch(NavigationActions.navigate({
                  routeName: 'MonitorPoint',
                  params: {
                    dgimn: item.Dgimn
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
  renderDate=() => (
    <Text style={{ marginLeft: 10, fontSize: 12, color: '#fff' }}>
      {`监测时间:${this.props.lastmonitordata[0]}` ? this.props.lastmonitordata[0].Time : ''}
    </Text>
  )
  renderLastData=(item) => {
    let rtnVal;
    if (this.props.lastmonitorpoint != null && this.props.lastmonitorpoint.DGIMN === item.Dgimn) {
      if (this.props.spinning) {
        rtnVal = <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}><Text style={{ fontSize: 15, color: '#747270' }}>{'正在加载中'}</Text></View>;
      } else if (this.props.lastmonitordata.length === 0) {
        rtnVal = <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}><Text style={{ fontSize: 15, color: '#747270' }}>{'没有查询到数据'}</Text></View>;
      } else {
        rtnVal = [];

        this.props.lastmonitordata.map((item, key) => {
          if (key < 6) {
            let color = '#747270';
            if (item.StandardColor !== '') {
              color = item.StandardColor;
            }
            rtnVal.push(
              <View
                key={key}
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
  render() {
    const coordinateset = GetPointsCenter(this.props.targetBase.TargetInfo.CoordinateJson);
    if (coordinateset !== null) {
      return (
        <View style={{ flex: 1 }}>
          <MapView
            ref={ref => { this.mapView = ref; }}
            rotateEnabled
            tiltEnabled
            zoomLevel={13}
            coordinate={coordinateset}
            style={StyleSheet.absoluteFill}
          >
            <Polygon
              strokeWidth={2}
              fillColor="rgba(0, 0, 0, 0)"
              strokeColor="#108ee9"
              coordinates={this.props.targetBase.TargetInfo.CoordinateJson}
            />
            {this.renderPoint()}
          </MapView>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <MapView
          ref={ref => { this.mapView = ref; }}
          rotateEnabled
          tiltEnabled
          style={StyleSheet.absoluteFill}
        >
          <Polygon
            strokeWidth={2}
            fillColor="rgba(0, 0, 0, 0)"
            strokeColor="#108ee9"
            coordinates={this.props.targetBase.TargetInfo.CoordinateJson}
          />
          {this.renderPoint()}
        </MapView>
      </View>
    );
  }
}

export default TargetMapComponent;
