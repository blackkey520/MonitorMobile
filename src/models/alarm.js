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
        AlarmDetail: ({ params: { alarmdgimn, alarmbegindate, alarmenddate } }) => {
          dispatch({ type: 'loadalarmlist',
            payload: {
              alarmdgimn,
              alarmbegindate,
              alarmenddate,
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
      const { data } = yield call(AlarmService.uploadimage, { Img: image.data, FileType: `.${image.fileName.split('.')[1].toLowerCase()}` });
      image.uploadID = data;
      callback(image);
    },
    * postfeedback({ payload: { postjson, callback } }, { callWithSpinning }) {
      yield callWithSpinning(AlarmService.postfeedback, postjson, { imagelist: [] });
      callback();
    },
    * loadmorealarmlist({ payload: { current } }
      , { callWithLoading, update, select }) {
      let { alarmlist } = yield select(state => state.alarm);
      const { alarmdgimn, alarmbegindate, alarmenddate, pagesize }
      = yield select(state => state.alarm);
      const { data, total } = yield callWithLoading(AlarmService.loadalarmlist,
        { dgimn: alarmdgimn,
          starttime: alarmbegindate,
          endtime: alarmenddate,
          pageindex: current,
          pagesize }, { alarmcurrent: current });
      if (data != null && data.length !== 0) {
        alarmlist = alarmlist.concat(data);
      }
      yield update({ alarmlist,
        alarmtotal: Math.ceil(total / pagesize),
        alarmcurrent: current });
    },
    * loadalarmlist({ payload: { alarmdgimn, alarmbegindate, alarmenddate } },
      { callWithLoading, select, update }) {
      const { pagesize } = yield select(state => state.alarm);
      const { data, total } = yield callWithLoading(AlarmService.loadalarmlist,
        { dgimn: alarmdgimn,
          starttime: alarmbegindate,
          endtime: alarmenddate,
          pageindex: 1,
          pagesize },
        { alarmlist: [],
          alarmdgimn,
          alarmbegindate,
          alarmenddate,
          alarmcurrent: 1 });
      yield update({ alarmtotal: Math.ceil(total / pagesize),
        alarmlist: data !== null && data.length !== 0 ? data : [] });
    },
  },
});
