import { get } from '../dvapack/request';
// 全局api文件
import api from '../config/globalapi';

export const getsystemconfig = async () => {
  const result = await get(api.system.systemconfig, {}, null, '48f3889c-af8d-401f-ada2-c383031af92d');
  return result;
};
export const loadpollutanttype = async () => {
  const result = await get(api.monitorpoint.monitortype, {}, null);
  return result;
};
