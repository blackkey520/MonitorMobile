import { getUseNetConfig } from '../logics/rpc';
import * as AlarmService from '../services/alarmService';
import { Model } from '../dvapack';

export default Model.extend({
  namespace: 'feedback',
  state: {
    feedbackdetail: null,
    alarmdetail: [],
  },
  reducers: {},
  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen({
        FeedbackDetail: ({ params: { verifyID } }) => {
          dispatch({
            type: 'getfeedbackdetail',
            payload: {
              verifyID
            }
          });
        },
      });
    },
  },
  effects: {
    * getfeedbackdetail({ payload: { verifyID } }, { call, put, select }) {
      let feedbackresult = null;
      let alarmresult = null;
      yield put('showLoading', {});
      feedbackresult = yield call(AlarmService.getfeedbackdetail, { verifyID });
      const netconfig = getUseNetConfig();
      feedbackresult.data.img = [];
      feedbackresult.data.lowimg = [];
      feedbackresult.data.thumbimg = [];
      if (feedbackresult.data.ImgList !== '') {
        const imgList = feedbackresult.data.imglist.split(',');
        const lowimgList = feedbackresult.data.lowimglist.split(',');
        const thumbimgList = feedbackresult.data.thumbimglist.split(',');
        imgList.map((item, key) => {
          if (item !== '') {
            feedbackresult.data.img.push(`${netconfig.neturl}/upload/${imgList[key]}`);
            feedbackresult.data.lowimg.push(`${netconfig.neturl}/upload/${lowimgList[key]}`);
            feedbackresult.data.thumbimg.push(`${netconfig.neturl}/upload/${thumbimgList[key]}`);
          }
        });
      }
      alarmresult = yield call(AlarmService.getfeddbackalarmdetail, { verifyID });
      yield put('hideLoading', { feedbackdetail: feedbackresult.data, alarmdetail: alarmresult.data });
    },
  }
});
