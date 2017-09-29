import { createAction, NavigationActions,ShowToast,ShowResult} from '../utils'
import { getNetConfig } from '../logics/rpc';
import * as AlarmService from '../services/alarmService'
import moment from 'moment'
  const now = new Date();
export default {
  namespace: 'feedback',
  state: {
    feedbackdetail:null,
    alarmdetail:[],
    fetching:false
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
    *getfeedbackdetail({ payload: {verifyID} }, { call, put ,select}){
      let result=null;
      let alarmresult=null;
      const state = yield select(state => state.alarm);
      yield put(
        NavigationActions.navigate({
          routeName: 'FeedbackDetail',params:{
            verifyid:verifyID,
        },})
      )
      yield put(createAction('fetchStart')({}));
      result = yield call(AlarmService.getfeedbackdetail,{verifyID:verifyID})
      let netconfig=getNetConfig();
      let img=[],lowimg=[],thumbimg=[];
      if(result.data.ImgList!='')
      {
        let imgList=result.data.imglist.split(',');
        let lowimgList=result.data.lowimglist.split(',');
        let thumbimgList=result.data.thumbimglist.split(',');
        imgList.map((item,key)=>{
          if(item!='')
          {
            img.push(netconfig.neturl+'/upload/'+imgList[key]);
            lowimg.push(netconfig.neturl+'/upload/'+lowimgList[key]);
            thumbimg.push(netconfig.neturl+'/upload/'+thumbimgList[key]);
          }
        });
      }
      result.data.img=img;
      result.data.lowimg=lowimg;
      result.data.thumbimg=thumbimg;
      alarmresult = yield call(AlarmService.getfeddbackalarmdetail,{verifyID:verifyID})
      yield put(createAction('fetchEnd')({feedbackdetail:result.data,alarmdetail:alarmresult.data}))
    },
  },
}