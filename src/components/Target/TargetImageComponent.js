

import React, { PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import ImagePicker from 'react-native-image-picker';
import { createAction, ShowLoadingToast, CloseToast, ShowResult } from '../../utils';

const SCREEN_HEIGHT = Dimensions.get('window').height;
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
@connect(({ target }) => ({ targetBase: target.targetBase }))
class TargetImageComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      newImageList: []
    };
  }
  uploadsuccess=(img) => {
    CloseToast();
    ShowResult(true, '上传成功');
    this.setState((state) => {
      // copy the map rather than modifying state.
      const imglist = state.newImageList;
      imglist.push(img);
      return { imglist };
    });
  }
  renderImage=() => {
    const rtnVal = [];
    this.props.targetBase.lowimg.map((item, key) => {
      rtnVal.push(<Image
        key={item}
        style={styles.img}
        source={{ uri: item }}
      />);
    });
    this.state.newImageList.map((item, key) => {
      if (item) {
        rtnVal.push(<Image
          key={item}
          style={styles.img}
          source={{ uri: item }}
        />);
      }
    });
    return rtnVal;
  }
  render() {
    return (
      <View style={{ backgroundColor: '#f0f0f0' }}>
        {
          this.props.targetBase.lowimg.length === 0 ?
            <View style={[styles.img, { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }]}>
              <Image source={require('../../images/noneimg.png')} style={{ height: 70, width: 100 }} />
              <Text style={{ marginTop: 15, color: '#716b6a' }}>{'没有图片'}</Text>
            </View>
            : <Swiper height={SCREEN_HEIGHT / 3} activeDotColor={'#4f6aea'}>
              {this.renderImage()}
            </Swiper>
        }
        <TouchableOpacity
          style={{ position: 'absolute', top: 20, left: SCREEN_WIDTH - 40 }}
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
                this.props.dispatch(createAction('target/uploadimage')({
                  image: response,
                  code: this.props.targetBase.TargetInfo.TargetCode,
                  callback: this.uploadsuccess,
                  baseType: this.props.targetBase.TargetInfo.baseType
                }));
              }
            });
          }}
        >
          <Image source={require('../../images/photo_on.png')} style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  img: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 3
  }
});


export default TargetImageComponent;
