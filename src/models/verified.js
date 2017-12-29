import moment from 'moment';
import * as AlarmService from '../services/alarmService';
import { Model } from '../dvapack';


export default Model.extend({
  namespace: 'verified',
  state: {
    verifiedlist: [],
    getmoreverified: true,
    fetchtime: null,
  },
  reducers: {},
  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen({
        Notification: ({ params }) => {
          dispatch({ type: 'loadverifiedlist',
            payload: {
              isfirst: true,
              time: moment().format('YYYY-MM-DD'),
            },
          });
        },
      });
    },
  },
  effects: {
    * loadverifiedlist({ payload: { isfirst, time } }, { callWithLoading, update, select }) {
      let { verifiedlist } = yield select(state => state.verified);
      if (isfirst) {
        yield update({ verifiedlist: [] });
      }
      const { data } = yield callWithLoading(AlarmService.loadaverifiedlist, { time });
      let getmoreverified = false;
      let fetchtime = moment(time).add(-6, 'days');
      if (data !== null) {
        if (data.length !== 0) {
          const sectionList = { key: data[0].VerifyTime.substring(0, 10),
            data };
          getmoreverified = true;
          if (isfirst) {
            verifiedlist = [];
            verifiedlist.push(sectionList);
          } else {
            const timeIndex = verifiedlist.findIndex(value => value.key
              === data[0].VerifyTime.substring(0, 10));
            if (timeIndex === -1) {
              verifiedlist = verifiedlist.concat(sectionList);
            }
          }
          fetchtime = new Date(`${data[0].VerifyTime.substring(0, 10)}T00:00:00`);
        }
      }
      const newtime = moment(fetchtime).add(-1, 'days').format('YYYY-MM-DD');
      yield update({ verifiedlist, fetchtime: newtime, getmoreverified });
    },
  },
});
