import { createAction, NavigationActions,ShowToast} from '../utils'
import * as authService from '../services/authService'
import * as AlarmService from '../services/alarmService'
import { loadStorage} from '../logics/rpc';
import JPushModule from 'jpush-react-native';
import moment from 'moment'
export default {
  namespace: 'app',
  state: {
    fetching: false,
    user: null,
    contactlist:[],
    ismaintenance:false
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
      *loaduser({ payload: { user } }, { call, put }) {
        yield put(createAction('changeState')({ user:user }))
      },
      *login({ payload: { username,password,pollutanttype} }, { call, put }) {
        let result=null;
        let ismaintenance=false;
        if(username==''|| password=='')
        {
            ShowToast('用户名，密码不能为空')
        }else{
          yield put(createAction('loginStart')())
          result = yield call(authService.login, {username,password})
          if (result.message=='') {
            JPushModule.setAlias(result.User_Account, (map) => {
      				if (map.errorCode === 0) {
      					console.log("set alias succeed");
      				} else {
      					console.log("set alias failed, errorCode: " + map.errorCode);
      				}
      			});
            let alarmCount = yield call(AlarmService.loadawaitcheck,
               {time:moment().format('YYYY-MM-DD')})
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
