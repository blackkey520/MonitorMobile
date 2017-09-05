import { createAction, NavigationActions,ShowToast} from '../utils'
import * as authService from '../services/authService'



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
      },
      *loaduser({ payload: { user } }, { call, put }) {
        yield put(createAction('changeState')({ user:user }))
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
            yield put(
              NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Main' })],
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
