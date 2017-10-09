/**
 * Created by tdzl2003 on 12/17/16.
 */

 import React from 'react'
 import { AppRegistry } from 'react-native'
 import dva from 'dva/mobile'
 import { persistStore, autoRehydrate } from 'redux-persist'

 import { registerModels } from './models'
 import Router from './router'
import { createLogger } from 'redux-logger'
 const logger = createLogger();
import globalstorage from './config/globalstorage'
if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {},
  };
}

const app = dva({
  initialState: {},
  // extraEnhancers: [autoRehydrate()],
  onError(e,dispatch) {
    
  },
  // onEffect(effect, sagaEffects, model){
  //
  // }
})
app.use({
  onAction: logger,
});
registerModels(app)
app.router(() => <Router />)
const App = app.start()

// eslint-disable-next-line no-underscore-dangle
AppRegistry.registerComponent('MonitorMobile', () => App);
