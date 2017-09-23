import { createAction, NavigationActions,ShowToast,ShowResult} from '../utils'
import { getNetConfig } from '../logics/rpc';
import * as AlarmService from '../services/alarmService'
import moment from 'moment'
  const now = new Date();
export default {
  namespace: 'alarm',
  state: {
    fetching:false,
    alarmdgimn:null,
    alarmlist:[],
    alarmbegindate:null,
    alarmenddate:null,
    alarmcurrent:1,
    alarmtotal:0,
    pagesize:10,
    postfetching:false
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
      *uploadimage({ payload: {image,callback} }, { call, put ,select}){
        let result=null;
        const state = yield select(state => state.alarm);
        if(!image.fileName)
        {
          image.fileName=image.uri.split('/')[image.uri.split('/').length-1];
        }
        result = yield call(AlarmService.uploadimage,{Img:image.data,FileType:'.'+image.fileName.split('.')[1].toLowerCase()})
        image.uploadID=result.data;
        callback(image);
      },
      *postfeedback({ payload: {postjson,callback} }, { call, put ,select}){
        let result=null;
        const state = yield select(state => state.alarm);
        yield put(createAction('updateState')({postfetching:true}));
        result = yield call(AlarmService.postfeedback,postjson)
        let newlist = yield call(AlarmService.loadalarmlist,
           {dgimn:state.alarmdgimn,starttime:state.alarmbegindate,endtime:state.alarmenddate,pageindex:1,pagesize:state.pagesize})
        yield put(createAction('updateState')({postfetching:false,imagelist:[],
          alarmtotal:Math.ceil(result.total/state.pagesize),
          alarmlist:newlist.data}));
        callback();
      },
      *loadmorealarmlist({ payload: {current} }, { call, put ,select}){
        let result=null;
        const state = yield select(state => state.alarm);
        yield put(createAction('fetchStart')({alarmcurrent:current}));
        result = yield call(AlarmService.loadalarmlist,
           {dgimn:state.alarmdgimn,starttime:state.alarmbegindate,endtime:state.alarmenddate,
             pageindex:current,pagesize:state.pagesize})
         let oldCollection=state.alarmlist;
         if(result&&result.data!=null&&result.data.length!=0)
         {
             oldCollection=oldCollection.concat(result.data);
         }
        yield put(createAction('fetchEnd')({alarmlist:oldCollection,
          alarmtotal:Math.ceil(result.total/state.pagesize),alarmcurrent:current}))
      },
      *loadalarmlist({ payload: {alarmdgimn,alarmbegindate,alarmenddate} }, { call, put ,select}){
        let result=null;
        const state = yield select(state => state.alarm);

        yield put(createAction('fetchStart')({alarmdgimn:alarmdgimn,alarmbegindate:alarmbegindate,
        alarmenddate:alarmenddate,alarmcurrent:1,alarmlist:[]}));
        result = yield call(AlarmService.loadalarmlist,
           {dgimn:alarmdgimn,starttime:alarmbegindate,endtime:alarmenddate,pageindex:1,pagesize:state.pagesize})
        yield put(createAction('fetchEnd')({alarmtotal:Math.ceil(result.total/state.pagesize),alarmlist:result&&result.data!=null&&result.data.length!=0?result.data:[]}))
      },
  },
}
