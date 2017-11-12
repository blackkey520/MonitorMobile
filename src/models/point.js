import moment from 'moment';
import { ShowToast, ShowResult } from '../utils';
import * as pointService from '../services/pointService';
import { getUseNetConfig, loadToken } from '../dvapack/storage';
import { Model } from '../dvapack';


export default Model.extend({
  namespace: 'point',
  state: {
    pointlist: [],
    selectedpoint: null,
    legend: [],
    collectpointlist: [],
    page: 0
  },
  reducers: {
  },
  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen({
        CollectPointList: ({ params: { PollutantType } }) => {
          dispatch({ type: 'loadcollectpointlist',
            payload: {
              pollutantType: PollutantType
            },
          });
        },
        MonitorList: ({ params }) => {
          dispatch({ type: 'fetchmore',
            payload: { page: 0 },
          });
        },
        MonitorPoint: ({ params: { dgimn } }) => {
          dispatch({ type: 'selectpoint',
            payload: {
              dgimn
            },
          });
        },
      });
    },
  },
  effects: {
    * collectpoint({ payload: { dgimn, callback }, }, { call, update, select }) {
      const { selectedpoint } = yield select(state => state.point);
      const user = yield loadToken();
      const { data: result } = yield call(pointService.collectpoint, { dgimn, user });

      if (result != null) {
        if (result === 1) {
          ShowResult(true, '关注成功');
          selectedpoint.Point.CollectStatus = 1;
        } else {
          ShowResult(true, '取消关注成功');
          selectedpoint.Point.CollectStatus = 0;
        }
        callback(result);
      }
      yield update({ selectedpoint });
    },
    * uploadimage({ payload: { image, dgimn, callback } }, { call, update }) {
      if (!image.fileName) {
        image.fileName = image.uri.split('/')[image.uri.split('/').length - 1];
      }
      yield call(pointService.uploadimage, { img: image.data, FileType: `.${image.fileName.split('.')[1].toLowerCase()}`, code: dgimn });
      const { data: selectedpoint } = yield call(pointService.selectsinglepoint,
        { dgimn, fileLength: 50000, width: 300 });
      const netconfig = getUseNetConfig();
      selectedpoint.img = [];
      selectedpoint.lowimg = [];
      selectedpoint.thumbimg = [];
      if (selectedpoint.ImgList !== '') {
        const imgList = selectedpoint.ImgList.split(',');
        const lowimgList = selectedpoint.LowimgList.split(',');
        const thumbimgList = selectedpoint.ThumbimgList.split(',');
        imgList.map((item, key) => {
          selectedpoint.img.push(`${netconfig.neturl}/upload/${imgList[key]}`);
          selectedpoint.lowimg.push(`${netconfig.neturl}/upload/${lowimgList[key]}`);
          selectedpoint.thumbimg.push(`${netconfig.neturl}/upload/${thumbimgList[key]}`);
        });
      }
      yield update({ selectedpoint });
      callback();
    },
    * selectpoint({ payload: { dgimn } }, { call, put, update, callWithLoading }) {
      const { data: selectedpoint } = yield callWithLoading(pointService.selectsinglepoint
        , { dgimn, fileLength: 50000, width: 300 });
      const netconfig = getUseNetConfig();
      selectedpoint.img = [];
      selectedpoint.lowimg = [];
      selectedpoint.thumbimg = [];
      if (selectedpoint.ImgList !== '') {
        const imgList = selectedpoint.ImgList.split(',');
        const lowimgList = selectedpoint.LowimgList.split(',');
        const thumbimgList = selectedpoint.ThumbimgList.split(',');
        imgList.map((item, key) => {
          selectedpoint.img.push(`${netconfig.neturl}/upload/${imgList[key]}`);
          selectedpoint.lowimg.push(`${netconfig.neturl}/upload/${lowimgList[key]}`);
          selectedpoint.thumbimg.push(`${netconfig.neturl}/upload/${thumbimgList[key]}`);
        });
      }

      if (selectedpoint.MonitorPointPollutant.length !== 0) {
        yield update({ selectedpoint });
        yield put('monitordata/searchdata', { dgimn,
          startDate: moment().add(-10, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          pollutant: selectedpoint.PollutantTypeInfo[0],
          dataType: 'realtime' });
      } else {
        ShowToast('该监测点没有绑定污染物');
      }
    },
    * fetchmore({ payload: { page } }, { put, call, update, select }) {
      yield put('showLoading', {});
      const { pollutanttype } = yield select(state => state.app);
      const pollutantType = pollutanttype[page].ID;
      const { data: pointlist } = yield call(pointService.fetchlist,
        { pollutantType, pageIndex: 1, pageSize: 10000 });
      const { data: legend } = yield call(pointService.getlegend, { pollutantType });
      yield update({ pointlist, legend, page });
      yield put('hideLoading', {});
    },
    * loadcollectpointlist({ payload }, { update, callWithLoading }) {
      const user = yield loadToken();
      const { data } = yield callWithLoading(pointService.getcollectpointlist,
        { pageIndex: 1, pageSize: 10000, user });
      yield update({ collectpointlist: data !== null && data.length !== 0 ? data : [] });
    },
  },
});
