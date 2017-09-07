import { createAction, NavigationActions,ShowToast} from '../utils'
import {ShowResult} from '../utils'
import * as monitordataService from '../services/monitordataService'
import { getNetConfig } from '../logics/rpc';
  import moment from 'moment'
export default {
  namespace: 'monitordata',
  state: {
    datafetching:false,
    lastmonitorpoint:null,
    lastmonitordata:[],
    startDate:moment().format('YYYY-MM-DD'),
    endDate:moment().add(1, 'days').format('YYYY-MM-DD'),
    monitordata:[],
    pollutant:'',
    dataType:'realtime',
    total:0,
    current:1
  },
  reducers: {
    fetchStart(state, { payload }) {
      return { ...state, ...payload, datafetching: true }
    },
    fetchEnd(state, { payload }) {
      return { ...state, ...payload, datafetching: false }
    },
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
        *searchlastdata({ payload: {dgimn} }, { call, put ,select}){
          let result=null;
          yield put(createAction('fetchStart')({lastmonitordata:[]}));
          result = yield call(monitordataService.getLastData,
             {dgimn:dgimn})
          yield put(createAction('fetchEnd')({ lastmonitorpoint:result.data.Point,
            lastmonitordata:result.data.RealtimeData!=null?result.data.RealtimeData:[]}))
        },

      *searchmore({ payload: {current} }, { call, put ,select}){
        let result=null;
        const monitor = yield select(state => state.monitordata);
          const point = yield select(state => state.point);
        yield put(createAction('fetchStart')({current:current}));
        result = yield call(monitordataService.searchdatalist,
           {PollutantCode:monitor.pollutant.PolluntCode,DGIMN:point.selectedpoint.Point.Dgimn,BeginTime:monitor.startDate,
           EndTime:monitor.endDate,pageIndex:current,pageSize:20,dataType:monitor.dataType})
        let newresult=monitor.monitordata;
        if(result&&result.data!=null)
        {
          newresult=newresult.concat(result.data);
        }
        yield put(createAction('fetchEnd')({ monitordata:newresult,total:result.total}))

      },
      *searchdata({ payload: {dataType,startDate,endDate,pollutant,dgimn} }, { call, put ,select}){

        let result=null;
        yield put(createAction('fetchStart')({dataType:dataType,startDate:startDate,endDate:endDate,pollutant:pollutant,current:1,monitordata:[]}));
        result = yield call(monitordataService.searchdatalist,
           {PollutantCode:pollutant.PolluntCode,DGIMN:dgimn,BeginTime:startDate,
           EndTime:endDate,pageIndex:1,pageSize:20,dataType:dataType})

        yield put(createAction('fetchEnd')({ monitordata:result.data!=null?result.data:[],current:1,total:result.total}))
      },
  },
}
