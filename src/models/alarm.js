import * as AlarmService from '../services/alarmService';
import { Model } from '../dvapack';

export default Model.extend({
  namespace: 'alarm',
  state: {
    alarmdgimn: null,
    alarmlist: [],
    alarmbegindate: null,
    alarmenddate: null,
    alarmcurrent: 1,
    alarmtotal: 0,
    pagesize: 10,
  },
  reducers: {},
  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen({
        AlarmDetail: ({ params: { DGIMN, alarmbegindate, alarmenddate } }) => {
          dispatch({ type: 'loadalarmlist',
            payload: {
              alarmdgimn: DGIMN,
              alarmbegindate,
              alarmenddate
            },
          });
        },
      });
    },
  },
  effects: {
    * uploadimage({ payload: { image, callback } }, { call }) {
      if (!image.fileName) {
        image.fileName = image.uri.split('/')[image.uri.split('/').length - 1];
      }
      const result = yield call(AlarmService.uploadimage, { Img: image.data, FileType: `.${image.fileName.split('.')[1].toLowerCase()}` });
      image.uploadID = result.data;
      callback(image);
    },
    * postfeedback({ payload: { postjson, callback } }, { callWithSpinning }) {
      yield callWithSpinning(AlarmService.postfeedback, postjson, { imagelist: [] });
      callback();
    },
    * loadmorealarmlist({ payload: { current } }, { callWithLoading, update, select }) {
      let result = null;
      let { alarmlist } = yield select(state => state.alarm);
      const { alarmdgimn, alarmbegindate, alarmenddate, pagesize }
      = yield select(state => state.alarm);
      result = yield callWithLoading(AlarmService.loadalarmlist,
        { dgimn: alarmdgimn,
          starttime: alarmbegindate,
          endtime: alarmenddate,
          pageindex: current,
          pagesize }, { alarmcurrent: current });
      if (result && result.data != null && result.data.length !== 0) {
        alarmlist = alarmlist.concat(result.data);
      }
      yield update({ alarmlist,
        alarmtotal: Math.ceil(result.total / pagesize),
        alarmcurrent: current });
    },
    * loadalarmlist({ payload: { alarmdgimn, alarmbegindate, alarmenddate } },
      { callWithLoading, update, select }) {
      let result = null;
      const { pagesize } = yield select(state => state.alarm);
      result = yield callWithLoading(AlarmService.loadalarmlist,
        { dgimn: alarmdgimn,
          starttime: alarmbegindate,
          endtime: alarmenddate,
          pageindex: 1,
          pagesize },
        { alarmdgimn,
          alarmbegindate,
          alarmenddate,
          alarmcurrent: 1 });
      yield update({ alarmtotal: Math.ceil(result.total / pagesize),
        alarmlist: result && result.data !== null && result.data.length !== 0 ? result.data : [] });
    },
  },
});
