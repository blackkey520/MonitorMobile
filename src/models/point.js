import { createAction, NavigationActions, ShowToast } from '../utils';
import { ShowResult } from '../utils';
import * as pointService from '../services/pointService';
import { getUseNetConfig } from '../logics/rpc';
import moment from 'moment';

export default {
  namespace: 'point',
  state: {
    fetching: false,
    result: [],
    selectedpoint: null,
    legend: [],
    pollutantType: '',
    monitordata: [],
    collectpointlist: [],
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
    * collectpoint({ payload: { dgimn, callback } }, { call, put, select }) {
      const state = yield select(state => state.point);
      result = yield call(pointService.collectpoint,
           { dgimn: state.selectedpoint.Point.Dgimn });
      const newselectedpoint = state.selectedpoint;
      if (result.data != null) {
        if (result.data == 1) {
          ShowResult(true, '关注成功');
          newselectedpoint.Point.CollectStatus = 1;
        } else {
          ShowResult(true, '取消关注成功');
          newselectedpoint.Point.CollectStatus = 0;
        }
        callback(result.data);
      }
      yield put(createAction('updateState')({ selectedpoint: newselectedpoint }));
    },
    * uploadimage({ payload: { image, dgimn, callback } }, { call, put, select }) {
      let result = null;
      const state = yield select(state => state.alarm);
      if (!image.fileName) {
        image.fileName = image.uri.split('/')[image.uri.split('/').length - 1];
      }
      result = yield call(pointService.uploadimage, { img: image.data, FileType: `.${image.fileName.split('.')[1].toLowerCase()}`, code: dgimn });

      const newImageresult = yield call(pointService.selectsinglepoint,
           { dgimn, fileLength: 50000, width: 300 });
      const netconfig = getUseNetConfig();
      let img = [],
        lowimg = [],
        thumbimg = [];
      if (newImageresult.data.ImgList != '') {
        const imgList = newImageresult.data.ImgList.split(',');
        const lowimgList = newImageresult.data.LowimgList.split(',');
        const thumbimgList = newImageresult.data.ThumbimgList.split(',');
        imgList.map((item, key) => {
          img.push(`${netconfig.neturl}/upload/${imgList[key]}`);
          lowimg.push(`${netconfig.neturl}/upload/${lowimgList[key]}`);
          thumbimg.push(`${netconfig.neturl}/upload/${thumbimgList[key]}`);
        });
      }
      newImageresult.data.img = img;
      newImageresult.data.lowimg = lowimg;
      newImageresult.data.thumbimg = thumbimg;
      yield put(createAction('updateState')({ selectedpoint: newImageresult.data }));
      callback();
    },
    * selectpoint({ payload: { dgimn } }, { call, put, select }) {
      const now = new Date();
      let result = null;
      const state = yield select(state => state.point);
      yield put(createAction('updateState')());
      result = yield call(pointService.selectsinglepoint,
           { dgimn, fileLength: 50000, width: 300 });
      const netconfig = getUseNetConfig();

      let img = [],
        lowimg = [],
        thumbimg = [];

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
      const pollutant = result.data.PollutantTypeInfo[0];
      if (result.data.MonitorPointPollutant.length != 0) {
        yield put(createAction('updateState')({ selectedpoint: result.data }));
        yield put(
          NavigationActions.navigate({
            routeName: 'MonitorPoint', params: { dgimn },
          }),
        );
        yield put({ type: 'monitordata/searchdata',
          payload: { dgimn,
            startDate: moment().add(-10, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            pollutant,
            dataType: 'realtime' } });
      } else {
        ShowToast('该监测点没有绑定污染物');
      }
    },
    * fetchmore({ payload: { pollutantType } }, { call, put, select }) {
      let result = null;
      const state = yield select(state => state.point);
      let newresult = state.result;
      yield put(createAction('fetchStart')({ pollutantType, result: [] }));
      result = yield call(pointService.fetchlist,
           { pollutantType, pageIndex: 1, pageSize: 10000 });
      newresult = result.data;
      const legend = yield call(pointService.getlegend, { pollutantType });

      yield put(createAction('fetchEnd')({ result: newresult, legend: legend.data }));
    },
    * loadcollectpointlist({ payload: { pollutantType } }, { call, put, select }) {
      let result = null;
      const state = yield select(state => state.point);
      yield put(createAction('fetchStart')({ pollutantType }));
      result = yield call(pointService.getcollectpointlist,
           { pageIndex: 1, pageSize: 10000 });
      yield put(createAction('fetchEnd')({ collectpointlist: result.data != null ? result.data : [] }));
      yield put(
          NavigationActions.navigate({
            routeName: 'CollectPointList',
          }),
        );
    },
  },
};
