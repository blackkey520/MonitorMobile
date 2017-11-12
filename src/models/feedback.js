import { getUseNetConfig } from '../dvapack/storage';
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
      yield put('showLoading', {});
      const { data: feedbackdetail } = yield call(AlarmService.getfeedbackdetail, { verifyID });
      const netconfig = getUseNetConfig();
      feedbackdetail.img = [];
      feedbackdetail.lowimg = [];
      feedbackdetail.thumbimg = [];
      if (feedbackdetail.ImgList !== '') {
        const imgList = feedbackdetail.imglist.split(',');
        const lowimgList = feedbackdetail.lowimglist.split(',');
        const thumbimgList = feedbackdetail.thumbimglist.split(',');
        imgList.map((item, key) => {
          if (item !== '') {
            feedbackdetail.img.push(`${netconfig.neturl}/upload/${imgList[key]}`);
            feedbackdetail.lowimg.push(`${netconfig.neturl}/upload/${lowimgList[key]}`);
            feedbackdetail.thumbimg.push(`${netconfig.neturl}/upload/${thumbimgList[key]}`);
          }
        });
      }
      const { data: alarmdetail } = yield call(AlarmService.getfeddbackalarmdetail, { verifyID });
      yield put('hideLoading', { feedbackdetail, alarmdetail });
    },
  }
});
