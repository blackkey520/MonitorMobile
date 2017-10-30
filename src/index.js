/**
 * Created by tdzl2003 on 12/17/16.
 */

 import React from 'react';
 import { AppRegistry } from 'react-native';
 import dva from 'dva/mobile';
 import { ShowToast } from './utils';
 import storage from './config/globalstorage';
 import { registerModels } from './models';
 import Router from './router';
 import { createLogger } from 'redux-logger';
 const logger = createLogger();
 import { test, getNetConfig, saveNetConfig, getUseNetConfig } from './logics/rpc';
 import api from './config/globalapi';
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
  //  onError(e, dispatch) {
  //    ShowToast('程序发生错误');
  //  },
   onEffect(effect, sagaEffects, model) {
     return function* (...args) {
       const config = getUseNetConfig();
       const url = `${config.neturl + api.system.nettest}`;
       const result = yield test(url, {}).then(async data => true, json => false);
       const CNConfig = [];
       const NetConfig = getNetConfig();
       if (result) {
         yield effect(...args);
       } else {
         NetConfig.map((item, key) => {
           if (config.neturl === item.neturl) {
             item.isuse = false;
           } else {
             item.isuse = true;
           }
           CNConfig.push(item);
         });
         saveNetConfig(CNConfig);
         ShowToast('网络断开');
       }
     };
   }
 });
 app.use({
   onAction: logger
 });
 registerModels(app);
 app.router(() => <Router />);
 const App = app.start();

// eslint-disable-next-line no-underscore-dangle
 AppRegistry.registerComponent('MonitorMobile', () => App);
