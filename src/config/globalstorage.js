import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
});
// storage.sync = {
//   netConfig(params) {
//     const { id, resolve, reject } = params;
//     const newconfig = [];
//     NetConfig.map((item, key) => {
//       item.neturl = `http://${item.configIp}:${item.configPort}`;
//       if (key === 0) {
//         item.isuse = true;
//       } else {
//         item.isuse = false;
//       }
//       newconfig.push(item);
//     });
//     saveNetConfig(newconfig);
//     resolve && resolve(newconfig);
//   },
// };

global.storage = storage;
// loadNetConfig();
