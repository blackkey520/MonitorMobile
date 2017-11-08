import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';
import JPushModule from 'jpush-react-native';
import { NavigationActions, ShowToast, delay } from '../utils';
import * as authService from '../services/authService';
import * as AlarmService from '../services/alarmService';
import * as systemConfig from '../services/systemService';
import { clearToken } from '../logics/rpc';
import { Model } from '../dvapack';

export default Model.extend({
  namespace: 'app',
  state: {
    user: null,
    contactlist: [],
    ismaintenance: false,
    badge: 0,
    pollutanttype: [],
    globalConfig: {}
  },
  subscriptions: {
    setupSubscriber({ listen }) {
      listen('ContactList', { type: 'loadcontactlist' });
    }
  },
  reducers: {
    changebadge(state, { payload }) {
      const badge = state.badge + payload.badge;
      JPushModule.setBadge(badge, (success) => {
        console.log(success);
      });
      return { ...state, badge };
    }
  },
  effects: {
    * loadglobalvariable({ payload }, { call, put, update }) {
      const { user } = payload;
      const globalConfig = yield call(systemConfig.getsystemconfig);
      if (user && user != null) {
        const alarmCount = yield call(AlarmService.loadawaitcheck, { time: moment().format('YYYY-MM-DD') });
        const pollutanttype = yield call(systemConfig.loadpollutanttype);
        yield put('changebadge', { badge: alarmCount.data.length });
        yield put('hideSpinning', { pollutanttype });
        yield put(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main', params: { unverifiedCount: alarmCount.data.length, pollutanttype } })],
          }),
        );
      }
      yield update({ globalConfig, user });
      yield call(delay, 500);
      SplashScreen.hide();
    },
    * loadcontactlist({ payload }, { update, callWithLoading }) {
      let contactlist = [];
      contactlist = yield callWithLoading(authService.getcontactlist, {});
      yield update({ contactlist });
    },
    * login({ payload: { username, password } }, { update, call, put }) {
      let user = null;
      let ismaintenance = false;
      if (username === '' || password === '') {
        ShowToast('用户名，密码不能为空');
      } else {
        yield put('showSpinning', {});
        user = yield call(authService.login, { username, password });
        if (user.message === '') {
          yield put('loadglobalvariable', { user });
        } else if (result.message === '系统维护中') {
          ismaintenance = true;
        } else {
          ShowToast(result.message);
        }
        yield update({ ismaintenance });
      }
    },
    * ModifyPassword({ payload: { authorCode, userPwdOld, userPwdNew, userPwdTwo } }
      , { call, put }) {
      let result = null;
      // yield put(createAction('loginStart')({}));
      result = yield call(authService.resetPwd, { authorCode, userPwdOld, userPwdNew, userPwdTwo });
      if (result.substring(0, 4) !== '修改成功') {
        ShowToast(result);
      } else {
        clearToken();
        JPushModule.deleteAlias(() => {});
        yield put(NavigationActions.navigate({ routeName: 'Login' }));
      }
    },
  }
});
