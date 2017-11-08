

import React, { PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal
} from 'react-native';
import { connect } from 'react-redux';
import { MapView, Marker } from 'react-native-amap3d';
import Swiper from 'react-native-swiper';
import LoadingComponent from '../../components/Common/LoadingComponent';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

@connect(({ feedback }) => ({ fetching: feedback.fetching,
  feedbackdetail: feedback.feedbackdetail }))
class FeedbackDetailInfo extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      selectindex: 0
    };
  }

  setModalVisible(visible, index) {
    this.setState({ modalVisible: visible, selectindex: index });
  }
  renderPickedImage=() => {
    const rtnVal = [];
    this.props.feedbackdetail.thumbimg.map((item, key) => {
      if (item !== '') {
        const source = { uri: item };
        rtnVal.push(
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(true, key);
            }}
            key={item}
            style={{ marginTop: 10, marginLeft: 10, width: SCREEN_WIDTH / 4 - 20, height: SCREEN_WIDTH / 4 - 20, borderColor: '#a3a3a3', borderWidth: 1 }}
          >
            <Image
              source={source}
              style={{ width: SCREEN_WIDTH / 4 - 20,
                height: SCREEN_WIDTH / 4 - 20 }}
            />
          </TouchableOpacity>
        );
      }
    });
    return rtnVal;
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>

        {
          this.props.fetching || this.props.feedbackdetail == null ?
            <LoadingComponent Message={'正在加载数据'} />
            : <View>
              <Modal
                animationType={'none'}
                transparent
                visible={this.state.modalVisible}
                onRequestClose={() => { this.setModalVisible(false); }}
              >
                <Swiper height={SCREEN_HEIGHT} index={this.state.selectindex} activeDotColor={'#4f6aea'}>
                  {
                    this.props.feedbackdetail.img.map((item, key) => {
                      if (item !== '') {
                        const source = { uri: item };

                        return (<TouchableOpacity
                          onPress={() => {
                            this.setModalVisible(false);
                          }}
                          key={item}
                          style={{ flex: 1 }}
                        >

                          <Image resizeMode="contain" source={source} style={styles.backgroundImage} /></TouchableOpacity>);
                      }
                    })
                  }
                </Swiper>
              </Modal>
              <View style={{ width: SCREEN_WIDTH, height: 130 }}>
                <MapView
                  zoomLevel={14}
                  coordinate={{
                    latitude: this.props.feedbackdetail.latitude ?
                      this.props.feedbackdetail.latitude : 0,
                    longitude: this.props.feedbackdetail.longitude ?
                      this.props.feedbackdetail.longitude : 0,
                  }}
                  style={{ flex: 1 }}
                >
                  <Marker
                    icon={() =>
                      (<View style={{ width: 20, height: 20 }}>
                        <Image style={{ width: 20, height: 20, tintColor: '#8f8d8d' }} source={require('../../images/marker.png')} />
                      </View>)
                    }
                    coordinate={{
                      latitude: this.props.feedbackdetail.latitude ?
                        this.props.feedbackdetail.latitude : 0,
                      longitude: this.props.feedbackdetail.longitude ?
                        this.props.feedbackdetail.longitude : 0,
                    }}
                  />
                </MapView>
              </View>

              <View style={{ flexDirection: 'row', height: 50, alignItems: 'center', }} >
                <Text style={{ marginLeft: 15, fontSize: 15, color: '#403e3e', borderBottomWidth: 1, borderBottomColor: '#a3a3a3' }}>
                  {'核实描述:'}
                </Text>
                <Text style={{ marginLeft: 15, fontSize: 14, color: '#8f8d8d' }}>{
                  this.props.feedbackdetail.reasonName
                }</Text>
              </View>
              <View style={{ flexDirection: 'row', height: 50, justifyContent: 'center', alignItems: 'center', }}>
                <Image source={require('../../images/alarm_long.png')} style={{ tintColor: '#0c66d4', width: 20, height: 20 }} />
                <Text style={{ marginLeft: 5, fontSize: 14, color: '#443f3f' }}>{`预计恢复时间:${this.props.feedbackdetail.recoveryTime}`}</Text>
              </View>
              <View style={{ flexDirection: 'column', width: SCREEN_WIDTH - 30 }}>
                <Text style={{ marginLeft: 15, fontSize: 15, color: '#403e3e', borderBottomWidth: 1, borderBottomColor: '#a3a3a3' }}>
                  {'核实描述:'}
                </Text>
                <Text style={{ marginLeft: 15, fontSize: 14, color: '#8f8d8d' }}>
                  {this.props.feedbackdetail.verifyMsg}
                </Text>
              </View>

              <View style={{ width: SCREEN_WIDTH - 30, marginLeft: 15, marginTop: 15 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start', }}>
                  {this.renderPickedImage()}
                </View>
              </View>

            </View>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: null,
    resizeMode: Image.resizeMode.contain,
    backgroundColor: 'rgba(0,0,0,0.5)',
  }
});


export default FeedbackDetailInfo;
