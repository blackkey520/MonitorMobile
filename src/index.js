/**
 * Created by tdzl2003 on 12/17/16.
 */

import React from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';

import dva from './utils/dva';
import { ShowToast } from './utils';
import storage from './config/globalstorage';
import { registerModels } from './models';
import Router from './router';

import { test, getNetConfig, saveNetConfig, getUseNetConfig } from './logics/rpc';

import api from './config/globalapi';

const logger = createLogger();

if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {}
  };
}
const app = dva({
  initialState: {},
  models: [],
  //  onError(e, dispatch) {
  //    ShowToast('程序发生错误');
  //  },
  onAction: logger,
  onEffect(effect, sagaEffects, model) {
    return function* (...args) {
      const config = getUseNetConfig();
      let url = `${config.neturl + api.system.nettest}`;
      let result = yield test(url, {}).then(async data => true, json => false);
      const CNConfig = [];
      const NetConfig = getNetConfig();
      if (result) {
        yield effect(...args);
      } else {
        const configBak = NetConfig.find((value, index, arr) => value.isuse === false);
        config.isuse = false;
        configBak.isuse = true;
        CNConfig.push(config);
        CNConfig.push(configBak);
        saveNetConfig(CNConfig);
        url = `${configBak.neturl + api.system.nettest}`;
        result = yield test(url, {}).then(async data => true, json => false);
        if (result) {
          yield effect(...args);
        } else {
          ShowToast('网络断开');
        }
      }
    };
  }
});
registerModels(app);
const App = app.start(<Router />);
persistStore(app.getStore(), {
  storage: AsyncStorage,
  blacklist: ['router']
});

// eslint-disable-next-line no-underscore-dangle
AppRegistry.registerComponent('MonitorMobile', () => App);
