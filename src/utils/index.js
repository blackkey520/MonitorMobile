
import { Toast, Modal } from 'antd-mobile';

const alert = Modal.alert;

export { NavigationActions } from 'react-navigation';

export const delay = time => new Promise(resolve => setTimeout(resolve, time));

export const createAction = type => payload => ({ type, payload });

export const ShowToast = (msg) => {
  Toast.info(msg, 1);
};
export const ShowAlert = (title, msg, timeout, config) => {
  let cfg = [{ text: '关闭', onPress: () => console.log('cancel') }];
  if (config && config.length > 0) {
    cfg = config;
  }
  const alertInstance = alert(title, msg, cfg);
  if (timeout) {
    setTimeout(() => {
      alertInstance.close();
    }, timeout);
  }
};
export const ShowResult = (type, msg) => {
  if (type) {
    Toast.success(msg, 1);
  } else {
    Toast.fail(msg, 1);
  }
};
export const ShowLoadingToast = (msg) => {
  Toast.loading(msg, 10000, () => {

  });
};
export const CloseToast = () => {
  Toast.hide();
};
export const GetPointsCenter = (corrdinateset) => {
  if (corrdinateset.length !== 0) {
    let maxX = corrdinateset[0].longitude;
    let maxY = corrdinateset[0].latitude;
    let minX = corrdinateset[0].longitude;
    let minY = corrdinateset[0].latitude;
    corrdinateset.map((item, key) => {
      minY = minY > item.latitude ? item.latitude : minY;
      maxY = maxY < item.latitude ? item.latitude : maxY;
      minX = minX > item.longitude ? item.longitude : minX;
      maxX = maxX > item.longitude ? item.longitude : maxX;
    });
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    return {
      latitude: centerY,
      longitude: centerX,
    };
  }

  return null;
};
export const FindMapImg = (imgName) => {
  switch (imgName) {
    case 'WasteWater_unOnLine.png':
      return require('../images/WasteWater_unOnLine.png');
      break;
    case '1_maintenance.png':
      return require('../images/1_maintenance.png');
      break;
    case '2_maintenance.png':
      return require('../images/2_maintenance.png');
      break;
    case '5_maintenance.png':
      return require('../images/5_maintenance.png');
      break;
    case '6_maintenance.png':
      return require('../images/6_maintenance.png');
      break;
    case '8_maintenance.png':
      return require('../images/8_maintenance.png');
      break;
    case '9_maintenance.png':
      return require('../images/9_maintenance.png');
      break;
    case '10_maintenance.png':
      return require('../images/10_maintenance.png');
      break;
    case '12_maintenance.png':
      return require('../images/12_maintenance.png');
      break;
    case 'atmosphere_Error.png':
      return require('../images/atmosphere_Error.png');
      break;
    case 'atmosphere_Over.png':
      return require('../images/atmosphere_Over.png');
      break;
    // case 'atmosphere_Over.gif':
    //   return require('../images/atmosphere_Over.gif');
    //   break;
    case 'atmosphere_unOnLine.png':
      return require('../images/atmosphere_unOnLine.png');
      break;
    case 'atmosphere.png':
      return require('../images/atmosphere.png');
      break;
    case 'Dust_exc.png':
      return require('../images/Dust_exc.png');
      break;
    // case 'Dust_Overdata.gif':
    //   return require('../images/Dust_Overdata.gif');
    //   break;
    case 'Dust_Unline.png':
      return require('../images/Dust_Unline.png');
      break;
    case 'Dust.png':
      return require('../images/Dust.png');
      break;
    case 'enter.png':
      return require('../images/enter.png');
      break;
    case 'Exhaust.png':
      return require('../images/Exhaust.png');
      break;
    // case 'Exhaust_Over.gif':
    //   return require('../images/Exhaust_Over.gif');
    //   break;
    case 'Exhaust_Over.png':
      return require('../images/Exhaust_Over.png');
      break;
    case 'Exhaust_Error.png':
      return require('../images/Exhaust_Error.png');
      break;
    case 'Exhaust_unOnLine.png':
      return require('../images/Exhaust_unOnLine.png');
      break;
    case 'MiniStation_Error.png':
      return require('../images/MiniStation_Error.png');
      break;
    case 'MiniStation_Over.png':
      return require('../images/MiniStation_Over.png');
      break;
    // case 'MiniStation_Over.gif':
    //   return require('../images/MiniStation_Over.gif');
    //   break;
    // case 'MiniStation_unOnLine.gif':
    //   return require('../images/MiniStation_unOnLine.png');
    //   break;
    case 'MiniStation.png':
      return require('../images/MiniStation.png');
      break;
    case 'Stench_Error.png':
      return require('../images/Stench_Error.png');
      break;
    case 'Stench_Over.png':
      return require('../images/Stench_Over.png');
      break;
    // case 'Stench_Over.gif':
    //   return require('../images/Stench_Over.gif');
    //   break;
    case 'Stench_unOnLine.png':
      return require('../images/Stench_unOnLine.png');
      break;
    case 'Stench.png':
      return require('../images/Stench.png');
      break;
    case 'VOC_Error.png':
      return require('../images/VOC_Error.png');
      break;
    case 'VOC_Over.png':
      return require('../images/VOC_Over.png');
      break;
    // case 'VOC_Over.gif':
    //   return require('../images/VOC_Over.gif');
    //   break;
    case 'VOC_unOnLine.png':
      return require('../images/VOC_unOnLine.png');
      break;
    case 'VOC.png':
      return require('../images/VOC.png');
      break;
    case 'WasteWater_Error.png':
      return require('../images/WasteWater_Error.png');
      break;
    case 'WasteWater_Over.png':
      return require('../images/WasteWater_Over.png');
      break;
    // case 'WasteWater_Over.gif':
    //   return require('../images/WasteWater_Over.gif');
    //   break;
    // case 'WasteWater_unOnLine.png':
    //   return require('../images/WasteWater_unOnLine.png');
    //   break;
    case 'WasteWater.png':
      return require('../images/WasteWater.png');
      break;
    case 'WaterQuality_Error.png':
      return require('../images/WaterQuality_Error.png');
      break;
    case 'WaterQuality_Over.png':
      return require('../images/WaterQuality_Over.png');
      break;
    // case 'WaterQuality_Over.gif':
    //   return require('../images/WaterQuality_Over.gif');
    //   break;
    case 'WaterQuality_unOnLine.png':
      return require('../images/WaterQuality_unOnLine.png');
      break;
    case 'WaterQuality.png':
      return require('../images/WaterQuality.png');
      break;
    case 'water_level0.png':
      return require('../images/water_level0.png');
      break;
    case 'water_level1.png':
      return require('../images/water_level1.png');
      break;
    case 'water_level2.png':
      return require('../images/water_level2.png');
      break;
    case 'water_level3.png':
      return require('../images/water_level3.png');
      break;
    case 'water_level4.png':
      return require('../images/water_level4.png');
      break;
    case 'water_level5.png':
      return require('../images/water_level5.png');
      break;
    case 'water_level6.png':
      return require('../images/water_level6.png');
      break;
    default:
  }
};
export const parseDate = (date) => {
  let isoExp,
    parts;
  isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s(\d\d):(\d\d):(\d\d)\s*$/;
  try {
    parts = isoExp.exec(date);
  } catch (e) {
    return null;
  }
  if (parts) {
    date = new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);
  } else {
    return null;
  }
  return date;
};
export const Event = {
  // 通过on接口监听事件eventName 如果事件eventName被触发，则执行callback回调函数
  on(eventName, callback) {
    // 你的代码
    if (!this.handles) {
      // this.handles={};
      Object.defineProperty(this, 'handles', {
        value: {},
        enumerable: false,
        configurable: true,
        writable: true,
      });
    }

    if (!this.handles[eventName]) {
      this.handles[eventName] = [];
    }
    this
      .handles[eventName]
      .push(callback);
  },
  // 触发事件 eventName
  emit(eventName) {
    // 你的代码
    if (this.handles[arguments[0]]) {
      for (let i = 0; i < this.handles[arguments[0]].length; i++) {
        this.handles[arguments[0]][i](arguments[1]);
      }
    }
  },
};
export const getCurrentScreen = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentScreen(route);
  }
  return route;
};
