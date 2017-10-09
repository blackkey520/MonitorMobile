import { createAction, NavigationActions,ShowToast} from '../utils'
import * as authService from '../services/authService'
import * as AlarmService from '../services/alarmService'
import * as systemConfig from '../services/systemService';
import { loadStorage} from '../logics/rpc';
import moment from 'moment'
import JPushModule from 'jpush-react-native';
export default {
  namespace: 'app',
  state: {
    fetching: false,
    user: null,
    contactlist:[],
    ismaintenance:false,
    badge:0
  },
  reducers: {
    loginStart(state, { payload }) {
      return { ...state, ...payload, fetching: true }
    },
    loginEnd(state, { payload }) {
      return { ...state, ...payload, fetching: false }
    },
    changeState(state,{payload}){
      return { ...state, ...payload}
    }
  },
  effects: {
      *changebadge({payload:{badge}},{call,put,select}){
        const state = yield select(state => state.app);
        let newbadge=  state.badge+badge;
          JPushModule.setBadge(newbadge, (success) => {
            console.log(success)
          });
        yield put(createAction('changeState')({ badge:newbadge}))
      },
      *loadcontactlist({ payload: {dgimn} }, { call, put ,select}){
        let result=null;
        yield put(createAction('loginStart')({}));
        result = yield call(authService.getcontactlist,{})
        yield put(createAction('loginEnd')({ contactlist:result!=null?result:[]}))
        yield put(
          NavigationActions.navigate({
            routeName: 'ContactList'
          })
        )
      },
      *login({ payload: { username,password} }, { call, put }) {
        let result=null;
        let ismaintenance=false;

        if(username==''|| password=='')
        {
            ShowToast('用户名，密码不能为空')
        }else{
          yield put(createAction('loginStart')())
          result = yield call(authService.login, {username,password})
          if (result.message=='') {

            let alarmCount = yield call(AlarmService.loadawaitcheck,
               {time:moment().format('YYYY-MM-DD')})
               let pollutanttype=yield call(systemConfig.loadpollutanttype, {});
              //  saveStorage('pollutantType',pollutanttype);
              //  saveStorage('alarmCount',alarmCount.data.length);
              //  debugger;
             yield put({type: 'changebadge',payload: {badge:alarmCount.data.length}})
             yield put({type: 'point/fetchmore',payload: {pollutantType:pollutanttype[0].ID}}) 
            yield put(
              NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Main' ,params:{unverifiedCount:alarmCount.data.length,pollutanttype:pollutanttype} })],
              })
            )
          }else{
              if(result.message=='系统维护中')
              {
                ismaintenance=true;
              }else{
                ShowToast(result.message)
              }
          }
        }

        yield put(createAction('loginEnd')({ user:result,ismaintenance:ismaintenance }))
      },
  },
}
