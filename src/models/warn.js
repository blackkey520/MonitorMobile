import moment from 'moment';
import * as AlarmService from '../services/alarmService';
import { Model } from '../dvapack';


export default Model.extend({
  namespace: 'warn',
  state: {
    warnlist: [],
    getmorewarn: true,
    fetchtime: null,
  },
  reducers: {},
  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      listen({
        Notification: ({ params }) => {
          dispatch({ type: 'loadwarnlist',
            payload: {
              isfirst: true,
              time: moment().format('YYYY-MM-DD')
            },
          });
        },
      });
    },
  },
  effects: {
    * loadwarnlist({ payload: { isfirst, time } }, { callWithLoading, update, select }) {
      let { warnlist } = yield select(state => state.warn);
      const { data } = yield callWithLoading(AlarmService.loadawaitcheck, { time });
      let getmorewarn = false;
      let fetchtime = moment(time).add(-6, 'days');
      if (data !== null) {
        if (data.length !== 0) {
          const sectionList = { key: data[0].DateNow.substring(0, 10), data };
          getmorewarn = true;
          if (isfirst) {
            warnlist = [];
            warnlist.push(sectionList);
          } else {
            const timeIndex = warnlist.findIndex(value => value.key
              === data[0].DateNow.substring(0, 10));
            if (timeIndex === -1) {
              warnlist = warnlist.concat(sectionList);
            }
          }
          fetchtime = new Date(data[0].DateNow.replace(' ', 'T'));
        }
      }
      const newtime = moment(fetchtime).add(-1, 'days').format('YYYY-MM-DD');
      yield update({ warnlist, fetchtime: newtime, getmorewarn });
    },
  },
});
