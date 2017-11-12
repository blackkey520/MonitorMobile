import * as targetService from '../services/targetService';
import { getUseNetConfig } from '../dvapack/storage';
import { Model } from '../dvapack';


export default Model.extend({
  namespace: 'target',
  state: {
    targetBase: null
  },
  reducers: {},
  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen({
        Target: ({ params: { targetCode, baseType } }) => {
          dispatch({ type: 'selecttarget',
            payload: {
              targetCode,
              baseType
            },
          });
        },
      });
    },
  },
  effects: {
    * uploadimage({ payload: { image, code, callback, baseType } }, { callWithSpinning }) {
      if (!image.fileName) {
        image.fileName = image.uri.split('/')[image.uri.split('/').length - 1];
      }
      yield callWithSpinning(targetService.uploadimage, { img: image.data,
        FileType: `.${image.fileName.split('.')[1].toLowerCase()}`,
        code,
        baseType });
      callback(image.uri);
    },
    * selecttarget({ payload: { targetCode, baseType } }, { call, put }) {
      yield put('showLoading', {});
      const { data: targetBase } = yield call(targetService.selecttarget,
        { targetCode, baseType, fileLength: 50000, width: 300 });
      targetBase.TargetInfo.CoordinateJson = [];
      targetBase.TargetInfo.baseType = baseType;
      const corrdinateset = JSON.parse(targetBase.TargetInfo.TargetCoordinateSet);
      if (corrdinateset != null) {
        corrdinateset[0][0].map((item, key) => {
          targetBase.TargetInfo.CoordinateJson.push({ latitude: item[1], longitude: item[0] });
        });
      } else {
        targetBase.TargetInfo.CoordinateJson = [];
      }
      const netconfig = getUseNetConfig();
      targetBase.img = [];
      targetBase.lowimg = [];
      targetBase.thumbimg = [];
      if (targetBase.ImgList !== '') {
        const imgList = targetBase.ImgList.split(',');
        const lowimgList = targetBase.LowimgList.split(',');
        const thumbimgList = targetBase.ThumbimgList.split(',');
        imgList.map((item, key) => {
          targetBase.img.push(`${netconfig.neturl}/upload/${imgList[key]}`);
          targetBase.lowimg.push(`${netconfig.neturl}/upload/${lowimgList[key]}`);
          targetBase.thumbimg.push(`${netconfig.neturl}/upload/${thumbimgList[key]}`);
        });
      }
      yield put('hideLoading', { newImageList: [], targetBase });
    },
  }
});
