import { createAction, NavigationActions,ShowToast,ShowResult} from '../utils'
import { getNetConfig } from '../logics/rpc';
import * as AlarmService from '../services/alarmService'
import moment from 'moment'
  const now = new Date();
export default {
  namespace: 'alarm',
  state: {
    fetching: false,
    awaitchecklist:[],
    fetchtime:null,
    unverifiedCount:0,
    verifiedfetching:false,
    verifiedlist:[],
    verifiedtime:null,
    alarmlistfetching:false,
    alarmdgimn:null,
    alarmlist:[],
    alarmbegindate:null,
    alarmenddate:null,
    alarmcurrent:1,
    alarmtotal:0,
    pagesize:10,
    postfetching:false,
    feedbackdetail:null,
    feedbackalarmdetail:[],
    feedbackdetailfetching:false
  },
  reducers: {
    fetchStart(state, { payload }) {
      return { ...state, ...payload, fetching: true }
    },
    fetchEnd(state, { payload }) {
      return { ...state, ...payload, fetching: false }
    },
    fetchVerifiedStart(state, { payload }) {
      return { ...state, ...payload, verifiedfetching: true }
    },
    fetchVerifiedEnd(state, { payload }) {
      return { ...state, ...payload, verifiedfetching: false }
    },
    alarmfetchStart(state, { payload }) {
      return { ...state, ...payload, alarmlistfetching: true }
    },
    alarmfetchEnd(state, { payload }) {
      return { ...state, ...payload, alarmlistfetching: false }
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
      yield put(createAction('updateState')({feedbackdetailfetching:true}));
      result = yield call(AlarmService.getfeedbackdetail,{verifyID:verifyID})
      let netconfig=getNetConfig();
      let img=[],lowimg=[],thumbimg=[];
      let newresult=state.result;
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
      yield put(createAction('updateState')({feedbackdetailfetching:false,feedbackdetail:result.data,feedbackalarmdetail:alarmresult.data}))
    },
      *uploadimage({ payload: {image,callback} }, { call, put ,select}){
        let result=null;
        const state = yield select(state => state.alarm);
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
        yield put(createAction('alarmfetchStart')({alarmcurrent:current}));
        result = yield call(AlarmService.loadalarmlist,
           {dgimn:state.alarmdgimn,starttime:state.alarmbegindate,endtime:state.alarmenddate,
             pageindex:current,pagesize:state.pagesize})
         let oldCollection=state.alarmlist;
         if(result&&result.data!=null&&result.data.length!=0)
         {
             oldCollection=oldCollection.concat(result.data);
         }
        yield put(createAction('alarmfetchEnd')({alarmlist:oldCollection,
          alarmtotal:Math.ceil(result.total/state.pagesize),alarmcurrent:current}))
      },
      *loadalarmlist({ payload: {alarmdgimn,alarmbegindate,alarmenddate} }, { call, put ,select}){
        let result=null;
        const state = yield select(state => state.alarm);

        yield put(createAction('alarmfetchStart')({alarmdgimn:alarmdgimn,alarmbegindate:alarmbegindate,
        alarmenddate:alarmenddate,alarmcurrent:1,alarmlist:[]}));
        result = yield call(AlarmService.loadalarmlist,
           {dgimn:alarmdgimn,starttime:alarmbegindate,endtime:alarmenddate,pageindex:1,pagesize:state.pagesize})
        yield put(createAction('alarmfetchEnd')({alarmtotal:Math.ceil(result.total/state.pagesize),alarmlist:result&&result.data!=null&&result.data.length!=0?result.data:[]}))
      },
      *loadverifiedlist({ payload: {isfirst,time} }, { call, put ,select}){
        let result=null;
        const state = yield select(state => state.alarm);
        yield put(createAction('fetchVerifiedStart')());
        result = yield call(AlarmService.loadaverifiedlist,
           {time:time})
         let oldCollection=[];
         if(result&&result.data!=null&&result.data.length!=0)
         {
           if(isfirst)
           {
             let sectionList={key: result.data[0].VerifyTime.substring(0,10), data: result.data}
             oldCollection.push(sectionList);
           }else{
             oldCollection=state.verifiedlist;
             let sectionList={key:  result.data[0].VerifyTime.substring(0,10), data: result.data}
             oldCollection=oldCollection.concat(sectionList);
           }
         }
         let fetchtime = new Date(result.data[0].VerifyTime.substring(0,10)+'T'+'00:00:00');
         let newtime=moment(fetchtime).add(-1,'days').format('YYYY-MM-DD');
        yield put(createAction('fetchVerifiedEnd')({ verifiedlist:oldCollection,verifiedtime:newtime}))
      },
      *loadawaitchecklist({ payload: {isfirst,time} }, { call, put ,select}){
        let result=null;
        const state = yield select(state => state.alarm);
        yield put(createAction('fetchStart')());

        result = yield call(AlarmService.loadawaitcheck,
           {time:time})
         let oldCollection=[];
         let fetchtime=now;
         if(result&&result.data!=null&&result.data.length!=0)
         {
           if(isfirst)
           {
             let sectionList={key: result.data[0].DateNow.substring(0,10), data: result.data}
             oldCollection.push(sectionList);
           }else{
             oldCollection=state.awaitchecklist;
             let sectionList={key: result.data[0].DateNow.substring(0,10), data: result.data}
             oldCollection=oldCollection.concat(sectionList);
           }
           fetchtime = new Date(result.data[0].DateNow.replace(' ','T'));
         }
         let newtime=moment(fetchtime).add(-1,'days').format('YYYY-MM-DD');

        yield put(createAction('fetchEnd')({ awaitchecklist:oldCollection,fetchtime:newtime,
          unverifiedCount:isfirst?result.data.length:state.unverifiedCount}))
      }
  },
}
