import { createAction, NavigationActions, ShowToast } from '../utils';
import * as targetService from '../services/targetService';
import * as pointService from '../services/pointService';
import { getUseNetConfig } from '../logics/rpc';
const now = new Date();
export default {
  namespace: 'target',
  state: {
    fetching: false,
    targetBase: null,
  },
  reducers: {
    fetchStart(state, { payload }) {
      return { ...state, ...payload, fetching: true };
    },
    fetchEnd(state, { payload }) {
      return { ...state, ...payload, fetching: false };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * uploadimage({ payload: { image, code, callback, baseType } }, { call, put, select }) {
      let result = null;
      const state = yield select(state => state.target);
      if (!image.fileName) {
        image.fileName = image.uri.split('/')[image.uri.split('/').length - 1];
      }
      result = yield call(targetService.uploadimage, { img: image.data,
        FileType: `.${image.fileName.split('.')[1].toLowerCase()}`,
        code,
        baseType });
        // yield put({ type: 'selecttarget', payload: { targetCode: code,baseType:baseType} });
      callback(image.uri);
    },
    * selecttarget({ payload: { targetCode, baseType } }, { call, put, select }) {
      let result = null;
      const state = yield select(state => state.point);
      yield put(
          NavigationActions.navigate({
            routeName: 'Target', params: { targettype: targetCode, targetcode: baseType },
          }),
        );
      yield put(createAction('fetchStart')());
      result = yield call(targetService.selecttarget,
           { targetCode, baseType, fileLength: 50000, width: 300 });
      result.data.TargetInfo.CoordinateJson = [];
      result.data.TargetInfo.baseType = baseType;
      const corrdinateset = JSON.parse(result.data.TargetInfo.TargetCoordinateSet);
      if (corrdinateset != null) {
        corrdinateset[0][0].map((item, key) => {
          result.data.TargetInfo.CoordinateJson.push({ latitude: item[1], longitude: item[0] });
        });
      } else {
        result.data.TargetInfo.CoordinateJson = [];
      }
      const netconfig = getUseNetConfig();
      let img = [],
        lowimg = [],
        thumbimg = [];
      const newresult = state.result;
      if (result.data.ImgList != '') {
        const imgList = result.data.ImgList.split(',');
        const lowimgList = result.data.LowimgList.split(',');
        const thumbimgList = result.data.ThumbimgList.split(',');
        imgList.map((item, key) => {
          img.push(`${netconfig.neturl}/upload/${imgList[key]}`);
          lowimg.push(`${netconfig.neturl}/upload/${lowimgList[key]}`);
          thumbimg.push(`${netconfig.neturl}/upload/${thumbimgList[key]}`);
        });
      }
      result.data.img = img;
      result.data.lowimg = lowimg;
      result.data.thumbimg = thumbimg;
      yield put(createAction('fetchEnd')({ newImageList: [], targetBase: result.data }));
    },
  },
};
