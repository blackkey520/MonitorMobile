import { ShowToast } from '../utils';
import { loadToken, get, posturl, getUseNetConfig } from '../logics/rpc';
// 全局api文件
import api from '../config/globalapi';

// lastData
export const getLastData = async (param) => {
  try {
    const user = await loadToken();
        // 构建参数对象
    const body = {
      authorCode: user.User_ID,
      dgimn: param.dgimn,
    };
    let result = [];
        // NOTE: 获取网络配置信息
    const netconfig = getUseNetConfig();
    const url = netconfig.neturl + api.monitordata.lastData;
    await get(url, body).then(async (data) => {
            // 处理 请求success
      if (data && data != null) {
        result = data;
      } else {
              // dispatch错误的原因
        ShowToast(data.reason);
      }
    }, (json) => {
      ShowToast('查询异常');
    });
    return result;
  } catch (e) {
    return e;
  } finally {
  }
};
export const searchdatalist = async (param) => {
  try {
    const user = await loadToken();

    const body = {
      authorCode: user.User_ID,
      PollutantCode: param.PollutantCode,
      DGIMN: param.DGIMN,
      BeginTime: param.BeginTime,
      EndTime: param.EndTime,
      pageIndex: param.pageIndex,
      pageSize: param.pageSize,
    };
    let result = [];
    // NOTE: 获取网络配置信息
    const netconfig = getUseNetConfig();
    let url = netconfig.neturl;
    if (param.dataType === 'realtime') {
      url += api.monitordata.realtimeData;
    } else if (param.dataType === 'minute') {
      url += api.monitordata.minuteData;
    } else if (param.dataType === 'hour') {
      url += api.monitordata.hourData;
    } else if (param.dataType === 'day') {
      url += api.monitordata.dayData;
    }
    await get(url, body).then(async (data) => {
        // 处理 请求success
      if (data && data != null) {
        result = data;
      } else {
          // dispatch错误的原因
        ShowToast(data.reason);
      }
    }, (json) => {
      ShowToast('查询异常');
    });
    return result;
  } catch (e) {
    return e;
  } finally {
  }
};
