import Storage from 'react-native-storage';
import NetConfig from '../config/NetConfig.json';
import { AsyncStorage } from 'react-native';
import { saveNetConfig,loadNetConfig } from '../logics/rpc';
import * as systemConfig from '../services/systemService';

var storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
})
storage.sync = {
    netConfig(params){
      let { id, resolve, reject } = params;
      let netconfig=NetConfig[0];
      netconfig.neturl="http://"+netconfig.configIp+":"+netconfig.configPort;
      saveNetConfig(netconfig);
      resolve && resolve(NetConfig[0]);
    },
    async PollutantType(params){
      let { id, resolve, reject } = params;
      let PollutantType= await systemConfig.loadpollutanttype();

      storage.save({
            key: 'PollutantType',
            data: PollutantType
          });
      resolve && resolve(PollutantType);
    }
  }

global.storage = storage;
  loadNetConfig();
