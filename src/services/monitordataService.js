import { get } from '../dvapack/request';
// 全局api文件
import api from '../config/globalapi';

export const getLastData = async (param) => {
  const body = {
    dgimn: param.dgimn
  };
  const result = await get(api.monitordata.lastData, body, null);
  return result;
};
export const searchdatalist = async (param) => {
  const body = {
    PollutantCode: param.PollutantCode,
    DGIMN: param.DGIMN,
    BeginTime: param.BeginTime,
    EndTime: param.EndTime,
    pageIndex: param.pageIndex,
    pageSize: param.pageSize
  };
  let url = '';
  if (param.dataType === 'realtime') {
    url = api.monitordata.realtimeData;
  } else if (param.dataType === 'minute') {
    url = api.monitordata.minuteData;
  } else if (param.dataType === 'hour') {
    url = api.monitordata.hourData;
  } else if (param.dataType === 'day') {
    url = api.monitordata.dayData;
  }
  const result = await get(url, body, null);
  return result;
};
