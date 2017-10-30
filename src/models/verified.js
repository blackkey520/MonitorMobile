import { createAction } from '../utils';
import * as AlarmService from '../services/alarmService';
import moment from 'moment';
export default {
  namespace: 'verified',
  state: {
    fetching: false,
    verifiedlist: [],
    getmoreverified: true,
    fetchtime: null,
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
    * loadverifiedlist({ payload: { isfirst, time } }, { call, put, select }) {
      let result = null;
      const state = yield select(state => state.verified);
      yield put(createAction('fetchStart')());
      result = yield call(AlarmService.loadaverifiedlist, { time });
      let getmoreverified = false;
      let oldCollection = state.verifiedlist;
      let fetchtime = moment(time).add(-6, 'days');
      if (result && result.data != null) {
        if (result.data.length != 0) {
          const sectionList = { key: result.data[0].VerifyTime.substring(0, 10), data: result.data };
          getmoreverified = true;
          if (isfirst) {
            oldCollection = [];
            oldCollection.push(sectionList);
          } else {
            const timeIndex = oldCollection.findIndex((value, index, arr) => value.key == result.data[0].VerifyTime.substring(0, 10));
            if (timeIndex === -1) {
              oldCollection = oldCollection.concat(sectionList);
            }
          }
          fetchtime = new Date(`${result.data[0].VerifyTime.substring(0, 10)}T` + '00:00:00');
        }
      }
      const newtime = moment(fetchtime).add(-1, 'days').format('YYYY-MM-DD');
      yield put(createAction('fetchEnd')({ verifiedlist: oldCollection, fetchtime: newtime, getmoreverified }));
    },
  },
};
