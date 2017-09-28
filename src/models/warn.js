import { createAction } from '../utils'
import * as AlarmService from '../services/alarmService'
import moment from 'moment'
export default {
  namespace: 'warn',
  state: {
    fetching: false,
    warnlist:[],
    getmorewarn:true,
    fetchtime:null
  },
  reducers: {
    fetchStart(state, { payload }) {
      return { ...state, ...payload, fetching: true }
    },
    fetchEnd(state, { payload }) {
      return { ...state, ...payload, fetching: false }
    },
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
      *loadwarnlist({ payload: {isfirst,time} }, { call, put ,select}){
        let result=null;
        const state = yield select(state => state.warn);
        yield put(createAction('fetchStart')());
        result = yield call(AlarmService.loadawaitcheck,
           {time:time})
         let getmorewarn=false;
         let oldCollection=state.warnlist;
         let fetchtime=moment(time).add(-6,'days');
         if(result&&result.data!=null)
         {
           if(result.data.length!=0)
           {
             let sectionList={key: result.data[0].DateNow.substring(0,10), data: result.data}
             getmorewarn=true;
             if(isfirst)
             {
               oldCollection=[];
               oldCollection.push(sectionList);
             }else{
               oldCollection=oldCollection.concat(sectionList);
             }
             fetchtime = new Date(result.data[0].DateNow.replace(' ','T'));
           }
         }
         let newtime=moment(fetchtime).add(-1,'days').format('YYYY-MM-DD');
         yield put(createAction('fetchEnd')({ warnlist:oldCollection,fetchtime:newtime,getmorewarn:getmorewarn}))
      }
  },
}
