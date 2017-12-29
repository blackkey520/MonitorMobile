

import React, { PureComponent } from 'react';

import {
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { createAction, ShowLoadingToast, CloseToast, ShowResult } from '../../utils';
import PointImageComponent from '../../components/Point/PointImageComponent';
import PointBaseMessage from '../../components/Point/PointBaseMessage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const options = {
  title: '选择照片',
  cancelButtonTitle: '关闭',
  takePhotoButtonTitle: '打开相机',
  chooseFromLibraryButtonTitle: '选择照片',
  quality: 0.1,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
@connect(({ point }) => ({ selectedpoint: point.selectedpoint }))
export default class PointDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collect: false,
    };
  }

    callback = (state) => {
      this.setState({ collect: state });
    }
    uploadsuccess = () => {
      CloseToast();
      ShowResult(true, '上传成功');
    }
    render() {
      return (
        <ScrollView >
          <PointImageComponent />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: 65,
              position: 'absolute',
              top: 10,
              left: SCREEN_WIDTH - 70,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.dispatch(createAction('point/collectpoint')({
                  dgimn: this.props.selectedpoint.Point.Dgimn, callback: this.callback }));
              }}
            >
              {this.props.selectedpoint.Point.CollectStatus === 1
                ? <Image
                  source={require('../../images/collect_press.png')}
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
                : <Image
                  source={require('../../images/collect_on.png')}
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />}
            </TouchableOpacity>
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
                    this
                      .props
                      .dispatch(createAction('point/uploadimage')({ image: response, dgimn: this.props.selectedpoint.Point.Dgimn, callback: this.uploadsuccess }));
                  }
                });
              }}
            >
              <Image
                source={require('../../images/photo_on.png')}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
            </TouchableOpacity>
          </View>
          <PointBaseMessage />
        </ScrollView>
      );
    }
}
