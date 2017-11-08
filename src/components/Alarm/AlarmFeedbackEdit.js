

import React, { PureComponent } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/zh-cn';
import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-amap3d';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, TextareaItem, DatePicker } from 'antd-mobile';
import WarningReason from '../../config/configjson/WarningReason.json';
import { createAction, NavigationActions, ShowToast, ShowResult, ShowLoadingToast, CloseToast } from '../../utils';


const SCREEN_WIDTH = Dimensions.get('window').width;

const options = {
  title: '选择照片',
  cancelButtonTitle: '关闭',
  takePhotoButtonTitle: '打开相机',
  chooseFromLibraryButtonTitle: '选择照片',
  quality: 0.1,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
@connect(({ alarm }) => ({ imagelist: alarm.imagelist,
  isuploading: alarm.isuploading,
  uploadimageID: alarm.uploadimageID }))
class AlarmFeedbackEdit extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      refresh: false,
      WarningReason: WarningReason[0],
      sceneDescription: '',
      RecoveryTime: moment().add(WarningReason[0].EstimatedTime, 'hours'),
      longitude: 0,
      latitude: 0,
      imagelist: []
    };
  }

  onDateChange=(date) => {
    this.setState({
      RecoveryTime: moment(date)
    });
  }


  scrollToInput =(reactNode: any) => {
  // Add a 'scroll' ref to your ScrollView
    this.refs.scroll.scrollToPosition(0, 130, false);
  }
  logLocationEvent = ({ nativeEvent }) => {
    this.setState({
      longitude: nativeEvent.longitude,
      latitude: nativeEvent.latitude
    });
  }
  feedbackCallback=() => {
    this.props.clearselected();
    this.props.dispatch(NavigationActions.back());
    CloseToast();
    ShowResult(true, '反馈成功');
  }
  uploadImageCallBack=(img) => {
    this.setState((state) => {
      // copy the map rather than modifying state.
      const imagelist = state.imagelist;
      const refresh = !state.refresh;
      imagelist.push(img);
      return { imagelist, refresh };
    });
    CloseToast();
  }
  renderPickedImage=() => {
    const rtnVal = [];
    this.state.imagelist.map((item, key) => {
      const source = { uri: item.uri };
      rtnVal.push(
        <View
          key={item.uploadID}
          style={{ marginTop: 10,
            marginLeft: 10,
            width: SCREEN_WIDTH / 4 - 20,
            height: SCREEN_WIDTH / 4 - 20,
            borderColor: '#a3a3a3',
            borderWidth: 1 }}
        >
          <Image
            source={source}
            style={{ width: SCREEN_WIDTH / 4 - 20,
              height: SCREEN_WIDTH / 4 - 20 }}
          />
          <TouchableOpacity
            onPress={() => {
              this.setState((state) => {
                const imagelist = state.imagelist;
                const removeIndex = state.imagelist.findIndex((value, index, arr) =>
                  value.uploadID === item.uploadID);
                imagelist.splice(removeIndex, 1);
                const refresh = !state.refresh;
                return { imagelist, refresh };
              });
            }}
            style={[{ position: 'absolute', top: 0, left: (SCREEN_WIDTH / 4 - 35) }]}
          >
            <Icon style={{ backgroundColor: 'rgba(0,0,0,0)' }} name="ios-close-outline" size={25} color={'#a3a3a3'} />
          </TouchableOpacity>
        </View>
      );
    });
    return rtnVal;
  }
  renderWarningReason=() => {
    const rtnVal = [];
    WarningReason.map((item, key) => {
      rtnVal.push(<Button
        key={item.ID}
        style={{ marginLeft: 10 }}
        type={this.state.WarningReason != null &&
        this.state.WarningReason.ID === item.ID ? 'primary' : 'ghost'}
        size="small"
        onClick={() => {
          const time = moment().add(item.EstimatedTime, 'hours');
          this.setState({
            WarningReason: item,
            RecoveryTime: time
          });
        }}
      >{item.ReasonType}</Button>);
    });
    return rtnVal;
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View>
          <KeyboardAwareScrollView ref="scroll">
            <View style={{ width: SCREEN_WIDTH, height: 130 }}>
              <MapView
                locationEnabled
                zoomLevel={14}
                coordinate={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                }}
                onLocation={this.logLocationEvent}
                style={{ flex: 1 }}
              />
            </View>
            <View style={{ flexDirection: 'row', height: 50, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }} >
              {this.renderWarningReason()}
            </View>
            <DatePicker
              mode="datetime"
              extra="请选择(可选)"
              title={<Text>{''}</Text>}
              onChange={this.onDateChange}
              value={this.state.RecoveryTime.toDate()}
            >
              <TimeComponent />
            </DatePicker>
            <View style={{ flexDirection: 'column', width: SCREEN_WIDTH - 30 }}>
              <Text style={{ marginLeft: 15, fontSize: 15, color: '#403e3e', borderBottomWidth: 1, borderBottomColor: '#a3a3a3' }}>
                {'核实描述:'}
              </Text>
              <TextareaItem
                rows={5}
                count={200}
                onFocus={(event: Event) => {
                  this.scrollToInput(ReactNative.findNodeHandle(event.target));
                }}
                value={this.state.sceneDescription}
                onChange={(text) => {
                  this.setState({
                    sceneDescription: text
                  });
                }}
              />
            </View>
            <View style={{ width: SCREEN_WIDTH - 30, marginLeft: 15, marginTop: 15 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start', }}>
                {this.renderPickedImage()}
                <TouchableOpacity
                  onPress={() => {
                    ImagePicker.showImagePicker(options, (response) => {
                      if (response.didCancel) {
                        console.log('User cancelled image picker');
                      } else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                      } else if (response.customButton) {
                        console.log('User tapped custom button: ', response.customButton);
                      } else {
                        ShowLoadingToast('正在上传图片');
                        const imageIndex = this.state.imagelist
                          .findIndex((value, index, arr) => value.origURL === response.origURL);
                        if (imageIndex === -1) {
                          this.props.dispatch(createAction('alarm/uploadimage')({
                            image: response,
                            callback: this.uploadImageCallBack
                          }));
                        } else {
                          ShowToast('图片已经在列表中');
                        }
                      }
                    });
                  }}
                  style={{ marginTop: 10,
                    marginLeft: 10,
                    width: SCREEN_WIDTH / 4 - 20,
                    height: SCREEN_WIDTH / 4 - 20,
                    borderColor: '#a3a3a3',
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center', }}
                >
                  <Icon style={{ backgroundColor: 'rgba(0,0,0,0)' }} name="ios-add-outline" size={70} color={'#a3a3a3'} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 15, width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center', }}>
              <Button
                className="btn"
                style={{ width: 180 }}
                type="primary"
                onClick={() => {
                  ShowLoadingToast('正在提交');
                  let paramExceptionProcessingID = '';
                  let paramImageID = '';
                  this.props.selected.forEach((item, key, mapObj) => {
                    paramExceptionProcessingID += `${key.toString()},`;
                  });

                  this.state.imagelist.map((item, key) => {
                    paramImageID += `${item.uploadID},`;
                  });
                  this.props.dispatch(createAction('alarm/postfeedback')({
                    postjson: {
                      DGIMN: this.props.alarmdgimn,
                      ExceptionProcessingID: paramExceptionProcessingID,
                      WarningReason: this.state.WarningReason.ID,
                      sceneDescription: this.state.sceneDescription,
                      ImageID: paramImageID,
                      feedbackTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                      RecoveryTime: this.state.RecoveryTime.format('YYYY-MM-DD HH:mm:ss'),
                      longitude: this.state.longitude,
                      latitude: this.state.latitude
                    },
                    callback: this.feedbackCallback
                  }));
                }}
              >提交</Button>
            </View>
          </KeyboardAwareScrollView>

        </View>
      </View>
    );
  }
}
const TimeComponent = props => (
  <TouchableOpacity onPress={props.onClick} style={{ flexDirection: 'row', height: 50, justifyContent: 'center', alignItems: 'center', }}>
    <Image source={require('../../images/alarm_long.png')} style={{ tintColor: '#0c66d4', width: 20, height: 20 }} />
    <Text style={{ marginLeft: 5, fontSize: 14, color: '#443f3f' }}>{`预计恢复时间:${props.extra}`}</Text>
  </TouchableOpacity>
);

export default AlarmFeedbackEdit;
