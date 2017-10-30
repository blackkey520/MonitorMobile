import { createAction, NavigationActions, ShowToast, delay } from '../utils';
import * as authService from '../services/authService';
import * as AlarmService from '../services/alarmService';
import * as systemConfig from '../services/systemService';
import { clearToken } from '../logics/rpc';
import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';
import JPushModule from 'jpush-react-native';
export default {
  namespace: 'app',
  state: {
    fetching: false,
    user: null,
    contactlist: [],
    ismaintenance: false,
    badge: 0,
    errorMsg: '',
    pollutanttype: [],
    globalConfig: {}
  },
  reducers: {
    loginStart(state, { payload }) {
      return { ...state, ...payload, fetching: true };
    },
    loginEnd(state, { payload }) {
      return { ...state, ...payload, fetching: false };
    },
    changeState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * loadsystemconfig({ payload }, { call, put, select }) { 
      const globalConfig = yield call(systemConfig.getsystemconfig, {});
      yield put(createAction('changeState')({ globalConfig }));
    },
    * loadglobalvariable({ payload }, { call, put, select }) {
      const alarmCount = yield call(AlarmService.loadawaitcheck,
               { time: moment().format('YYYY-MM-DD') });
      const pollutanttype = yield call(systemConfig.loadpollutanttype, {});
      yield put({ type: 'changebadge', payload: { badge: alarmCount.data.length } });
      yield put({ type: 'point/fetchmore', payload: { pollutantType: pollutanttype[0].ID } });
      yield put(createAction('loginEnd')({ pollutanttype }));
      yield put(
              NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Main', params: { unverifiedCount: alarmCount.data.length } })],
              }),
            );
      yield call(delay, 500);
      SplashScreen.hide();
    },
    * changebadge({ payload: { badge } }, { call, put, select }) {
      const state = yield select(state => state.app);
      const newbadge = state.badge + badge;
      JPushModule.setBadge(newbadge, (success) => {
        console.log(success);
      });
      yield put(createAction('changeState')({ badge: newbadge }));
    },
    * loadcontactlist({ payload: { dgimn } }, { call, put, select }) {
      let result = null;
      yield put(createAction('loginStart')({}));
      result = yield call(authService.getcontactlist, {});
      yield put(createAction('loginEnd')({ contactlist: result != null ? result : [] }));
      yield put(
          NavigationActions.navigate({
            routeName: 'ContactList',
          }),
        );
    },
    * login({ payload: { username, password } }, { call, put }) {
      let result = null;
      let ismaintenance = false;

      if (username == '' || password == '') {
        ShowToast('用户名，密码不能为空');
      } else {
        yield put(createAction('loginStart')());
        result = yield call(authService.login, { username, password });
        if (result.message == '') {
          yield put({ type: 'loadglobalvariable', payload: { } });
        } else if (result.message == '系统维护中') {
          ismaintenance = true;
        } else {
          ShowToast(result.message);
        }
      }

      yield put(createAction('changeState')({ user: result, ismaintenance }));
    },
    * ModifyPassword({ payload: { authorCode, userPwdOld, userPwdNew, userPwdTwo } }, { call, put, select }) {
      let result = null;
        // yield put(createAction('loginStart')({}));
      result = yield call(authService.resetPwd, { authorCode, userPwdOld, userPwdNew, userPwdTwo });
      if (result.substring(0, 4) != '修改成功') {
        ShowToast(result);
      } else {
        clearToken();
        JPushModule.deleteAlias((result) => {});
        yield put(NavigationActions.navigate({ routeName: 'Login' }));
      }
    },
  },
};
