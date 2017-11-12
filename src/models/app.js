import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';
import JPushModule from 'jpush-react-native';
import { NavigationActions, ShowToast, delay } from '../utils';
import * as authService from '../services/authService';
import * as AlarmService from '../services/alarmService';
import * as systemConfig from '../services/systemService';
import { clearToken, saveToken, saveStorage, loadStorage } from '../dvapack/storage';
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
    /**
     * 更新待处理信息的数值
     * liz 2017.1.1
     * @param {any} state 
     * @param {any} { payload } 
     * @returns 
     */
    changebadge(state, { payload }) {
      const badge = state.badge + payload.badge;
      JPushModule.setBadge(badge, (success) => {
        console.log(success);
      });
      return { ...state, badge };
    }
  },
  effects: {
    /**
     * 获取全局变量
     * liz 2017.11.11
     * @param {any} { payload } 
     * @param {any} { call, put, update } 
     */
    * loadglobalvariable({ payload }, { call, put, update }) {
      const { user } = payload;
      let globalConfig = yield loadStorage('globalconfig');
      if (globalConfig == null) {
        const { data } = yield call(systemConfig.getsystemconfig);
        yield saveStorage('globalconfig', data);
        globalConfig = data;
      }
      if (user && user != null) {
        const { data: alarmCount } = yield call(AlarmService.loadawaitcheck, { time: moment().format('YYYY-MM-DD') });
        const { data: pollutanttype } = yield call(systemConfig.loadpollutanttype);
        yield put('changebadge', { badge: alarmCount.length });
        yield put('hideSpinning', { pollutanttype });
        yield put(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'MainNavigator', params: { unverifiedCount: alarmCount.length, pollutanttype } })],
          }),
        );
      }
      yield update({ globalConfig, user });
      yield call(delay, 500);
      SplashScreen.hide();
    },
    /**
     * 加载通讯录列表
     * liz 2017.11.11
     * @param {any} { payload } 
     * @param {any} { update, callWithLoading } 
     */
    * loadcontactlist({ payload }, { update, callWithLoading }) {
      const { data: contactlist } = yield callWithLoading(authService.getcontactlist, {});
      yield update({ contactlist });
    },
    /**
     * 登录
     * liz 2017.11.11
     * @param {any} { payload: { username, password } } 
     * @param {any} { update, call, put } 
     */
    * login({ payload: { username, password } }, { update, call, put }) {
      const ismaintenance = false;
      if (username === '' || password === '') {
        ShowToast('用户名，密码不能为空');
      } else {
        yield put('showSpinning', {});
        const { data: user } = yield call(authService.login, { username, password });
        if (user !== null) {
          yield saveToken(user);
          yield put('loadglobalvariable', { user });
        }
        // ismaintenance = true;
        yield update({ ismaintenance });
      }
    },
    /**
     * 修改密码
     * liz 2017.11.11
     * @param {any} { payload: { authorCode, userPwdOld, userPwdNew, userPwdTwo } } 
     * @param {any} { call, put } 
     */
    * ModifyPassword({ payload: { authorCode, userPwdOld, userPwdNew, userPwdTwo } }
      , { call, put }) {
      // yield put(createAction('loginStart')({}));
      const { data: result } = yield call(authService.resetPwd,
        { authorCode, userPwdOld, userPwdNew, userPwdTwo });
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
